
import User from "../models/UserModel.js";
import crypto from "crypto";
import { sanatizeUser } from "../services/common.js";
import Jwt from "jsonwebtoken";

const SECRET_KEY = "SECRET_KEY";

export const CreateUser = async (req, res) => {
    try {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256", async function (err, hashedPassword) {
        const user = new User({
          ...req.body,
          password: hashedPassword,
          salt

        });
        const doc = await user.save();
        req.login(sanatizeUser(doc),(err) => {
          if (err) {
            return res.status(400).json({ message: err.message });
          }else{
              const token = Jwt.sign(sanatizeUser(doc), SECRET_KEY);
            res.status(201).json({token});
          } 
        });
        
      }
        
      );
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  export const loginUser = async (req, res) => {
    res.json(req.user);
  };

  export const checkUser = async (req, res) => {
    res.json(req.user);
  };