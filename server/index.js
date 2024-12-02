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
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import { isAuth, sanatizeUser } from "./services/common.js";


 

const SECRET_KEY = "SECRET_KEY";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
  secretOrKey: 'SECRET_KEY', // Replace with your secret key
};




const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use(session({
  secret: "keyboard cat", resave: true, saveUninitialized: true })); 

app.use(passport.authenticate("session"));


app.use("/products",isAuth, ProductRouter);
app.use("/brands", BrandRouter);
app.use("/category", CategoryRouter);
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.use("/cart",isAuth, CartRouter);
app.use("/orders", OrderRouter);

// passport stategy
passport.use(new LocalStrategy(async function (username,password,done){
  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      return  done(null, false, { message: "User not found" });
    }

    crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", async function (err, hashedPassword){
      
       if(!crypto.timingSafeEqual(user.password, hashedPassword)){
        return done(null, false,{message:"Invalid Credentials"});
        
      } 
      const token = jwt.sign(sanatizeUser(user), SECRET_KEY);
         done(null,token);
      
    } ) 
  
  }catch (error) {
    console.log(error);
  }
}

  
));


  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        // Replace this with your user lookup logic
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
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
  console.log(user);
  process.nextTick(function() {
    return cb(null, user);
  });
});


connectDB();



app.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
