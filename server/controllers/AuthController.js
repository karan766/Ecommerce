import User from "../models/UserModel.js";
import crypto from "crypto";
import { sanatizeUser } from "../services/common.js";
import Jwt from "jsonwebtoken";
import { sendEMail , welcomeMail } from "./MailController.js";

const SECRET_KEY = process.env.SECRET_KEY;

export const CreateUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({
          ...req.body,
          password: hashedPassword,
          salt,
        });
        const doc = await user.save();
        welcomeMail({email:doc.email});
        req.login(sanatizeUser(doc), (err) => {
          if (err) {
            return res.status(400).json({ message: err.message });
          } else {
            const token = Jwt.sign(sanatizeUser(doc), SECRET_KEY || "SECRET_KEY");
            const isProduction = process.env.NODE_ENV === 'production';
            
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 36000000),
                httpOnly: true,
                secure: isProduction, // Only secure in production
                sameSite: isProduction ? 'none' : 'lax', // Allow cross-site cookies in production
              })
              .status(201)
              .json({ id: doc.id, role: doc.role });
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const user = req.user;
  const isProduction = process.env.NODE_ENV === 'production';
  
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 36000000),
      httpOnly: true,
      secure: isProduction, // Only secure in production
      sameSite: isProduction ? 'none' : 'lax', // Allow cross-site cookies in production
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    })
    .sendStatus(200)
};
export const checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

export const resetPasswordRequest = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email: email });
 
  if (user) {
    const token = crypto.randomBytes(16).toString("hex");
    await User.findOneAndUpdate({ email: email }, { resetPasswordToken: token }, { new: true });
      
    const resetPage =
      `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${email}`;
    const subject = "reset password for Ekart";
    const html = `<p>Click <a href='${resetPage}'>here</a> to reset your password</p>`;

    // send email to user
    if (email) {
      const response = await sendEMail({ to: email, subject, html, text: "" });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(404);
  }
};



export const resetPassword  = async (req, res) => {
  const { email, password, token } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();
        const subject = 'password successfully reset for e-commerce';
        const html = `<p>Successfully able to Reset Password</p>`;
        if (email) {
          const response = await sendEMail({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(400);
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
};


