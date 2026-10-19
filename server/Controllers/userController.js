
import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";

// Registering User
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check empty fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check user already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // Create verification token
    const token = jwt.sign(
      {
        id: newUser._id,
        purpose: "email-verification",
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    // Save token in database
    newUser.token = token;
    await newUser.save();

    // Send verification email
    await verifyEmail(token, email);

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
    });

  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// Verifying Email
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Check authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check token purpose
    if (decoded.purpose !== "email-verification") {
      return res.status(401).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Check stored token
    if (user.token !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    // Update verification status
    user.isVerified = true;
    user.token = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("Verify error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Verification token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
