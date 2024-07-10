import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/email.js";
import validator from "validator";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(412).json({ message: "Invalid email format" });
    }
    if (!validator.isLength(username, { min: 3, max: 50 })) {
      return res
        .status(412)
        .json({ message: "Username must be between 3 and 50 characters" });
    }
    if (
      !validator.isLength(password, { min: 6, max: 20 }) ||
      !/(?=.*[a-z])/.test(password) ||
      !/(?=.*[A-Z])/.test(password) ||
      !/(?=.*[@$!%*?&])/.test(password)
    ) {
      return res
        .status(412)
        .json({
          message:
            "Password must be between 6-20 characters and contain at least one uppercase letter, one lowercase letter, and one special character",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "User signed in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (
      !validator.isLength(newPassword, { min: 6, max: 20 }) ||
      !/(?=.*[a-z])/.test(newPassword) ||
      !/(?=.*[A-Z])/.test(newPassword) ||
      !/(?=.*[@$!%*?&])/.test(newPassword)
    ) {
      return res
        .status(412)
        .json({
          message:
            "Password must be between 6-20 characters and contain at least one uppercase letter, one lowercase letter, and one special character",
        });
    }

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "username email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
