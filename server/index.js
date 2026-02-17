import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import ProductRouter from "./routes/ProductRoutes.js";
import BrandRouter from "./routes/BrandRoutes.js";
import CategoryRouter from "./routes/CategoryRoutes.js";
import UserRouter from "./routes/UserRoute.js";
import AuthRouter from "./routes/AuthRoute.js";
import CartRouter from "./routes/CartRoutes.js";
import OrderRouter from "./routes/OrderRoute.js";
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



const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const opts = {
  jwtFromRequest: cookieExtracter, // Extract JWT from the Authorization header
  secretOrKey: process.env.SECRET_KEY, // Replace with your secret key
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
  secret: "keyboard cat", resave: true, saveUninitialized: true })); 

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
      const storedPassword = Buffer.from(user.password); // Convert to Buffer
      const salt = Buffer.from(user.salt); // Convert to Buffer

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
        const token = jwt.sign(sanatizeUser(user), process.env.SECRET_KEY);

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
      const user = await User.findById( jwt_payload.id );

      if (user) {
        return done(null,sanatizeUser(user)); // If user is found, pass it to Passport
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
  const { totalAmount } = req.body;


  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });


  res.send({
    
    clientSecret: paymentIntent.client_secret,

    // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });
});


//Webhooks
app.post('/webhook', express.json({type: 'application/json'}), (request, response) => {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});


connectDB();



app.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
