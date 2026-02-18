import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import { seedMakes } from "./utils/seedMakes.js";
import ProductRouter from "./routes/ProductRoutes.js";
import BrandRouter from "./routes/BrandRoutes.js";
import CategoryRouter from "./routes/CategoryRoutes.js";
import UserRouter from "./routes/UserRoute.js";
import AuthRouter from "./routes/AuthRoute.js";
import CartRouter from "./routes/CartRoutes.js";
import OrderRouter from "./routes/OrderRoute.js";
import MakeRouter from "./routes/MakeRoutes.js";
import passport from "passport";
import session from "express-session";
import LocalStrategy from "passport-local";
import User from "./models/UserModel.js";
import crypto from "crypto";
import MailRouter from "./routes/MailRoutes.js";
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import Stripe from 'stripe';
import nodemailer from "nodemailer";
import { cookieExtracter, isAuth, sanatizeUser } from "./services/common.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import path from "path";
const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
const PORT = process.env.PORT || 8080;


const app = express();

// CORS configuration - explicit for production
const corsOptions = {
  origin: [
    'https://ecommerce-x9jr.onrender.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Add debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});
app.use(express.json());
dotenv.config();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Validate required environment variables (but don't exit in production)
const requiredEnvVars = ['MONGO_URL', 'SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

const opts = {
  jwtFromRequest: cookieExtracter, // Extract JWT from the Authorization header
  secretOrKey: process.env.SECRET_KEY || "SECRET_KEY", // Replace with your secret key
};

//Email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "karansodhi703@gmail.email",
    pass: process.env.MAIL_PASSWORD,
  },
});

app.use(session({
  secret: process.env.SECRET_KEY || "keyboard cat", 
  resave: false, 
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
})); 

app.use(passport.authenticate("session"));
// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.resolve(__dirname, 'build')));
app.use(cookieParser());
app.use(express.raw({type:"application/json"}));
app.use("/products",isAuth(), ProductRouter);
app.use("/brands",isAuth(), BrandRouter);
app.use("/category",isAuth(), CategoryRouter);
app.use("/makes",isAuth(), MakeRouter);
app.use("/users",isAuth(), UserRouter);
app.use("/auth", AuthRouter);
app.use("/cart",isAuth(), CartRouter);
app.use("/orders",isAuth(), OrderRouter);
app.use("/mail", MailRouter);



passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      
      // Ensure `user.password` and `user.salt` are Buffers
      const storedPassword = user.password instanceof Buffer ? user.password : Buffer.from(user.password);
      const salt = user.salt instanceof Buffer ? user.salt : Buffer.from(user.salt);

      // Hash the provided password
      crypto.pbkdf2(password, salt, 310000, storedPassword.length, "sha256", (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return done(err);
        }

        // Compare the hashed password with the stored password
        if (
          storedPassword.length !== hashedPassword.length ||
          !crypto.timingSafeEqual(storedPassword, hashedPassword)
        ) {
          return done(null, false, { message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(sanatizeUser(user), process.env.SECRET_KEY || "SECRET_KEY");

        // Return authenticated user data
        return done(null, { id: user.id, role: user.role, token });
      });
    } catch (error) {
      console.error("Error in LocalStrategy:", error);
      return done(error);
    }
  })
);



passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Use `await` to fetch the user from the database
      const user = await User.findById(jwt_payload.id);

      if (user) {
        return done(null, sanatizeUser(user)); // If user is found, pass it to Passport
      } else {
        return done(null, false); // If no user is found, pass `false`
      }
    } catch (err) {
      return done(err, false); // Handle errors
    }
  })
);



passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      role: user.role
    });
  });
});

passport.deserializeUser(function(user, cb) {
 
  process.nextTick(function() {
    return cb(null, user);
  });
});

//payments

// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)




app.post("/create-payment-intent", async (req, res) => {
  try {
    const { totalAmount } = req.body;

    // Validate totalAmount
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Ensure it's an integer
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});


//Webhooks
app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  try {
    const event = request.body;

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Here you would typically update your database to mark the order as paid
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('Payment method attached:', paymentMethod.id);
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
  } catch (error) {
    console.error('Webhook error:', error);
    response.status(400).json({error: 'Webhook handler failed'});
  }
});

connectDB();

// Seed default makes
// seedMakes();



app.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello World!" });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/debug", (req, res) => {
  res.json({
    origin: req.get('Origin'),
    headers: req.headers,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      CLIENT_URL: process.env.CLIENT_URL,
      PORT: process.env.PORT
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
