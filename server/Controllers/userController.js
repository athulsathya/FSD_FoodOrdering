import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../model/sessionModel.js";

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
      },
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

// reVerifying
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    //  Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    //  Generate verification token
    const token = jwt.sign(
      {
        id: user._id,
        purpose: "email-verification",
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      },
    );

    // Save new token in database
    user.token = token;
    await user.save();

    //  Send verification email
    await verifyEmail(token, user.email);

    // Success response
    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("ReVerify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
    });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is not exist on this email",
      });
    }

    // checking both passwords are same
    const passwordIsValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!passwordIsValid) {
      return res.status(400).json({
        success: false,
        message: "Password is not matching",
      });
    }
    if (existingUser.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Account is not verified. Verify and Login",
      });
    }

    // generate token
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );
    existingUser.isLoggedIn = true;
    await existingUser.save();

    //check for existing session and delete it.
    const existingSession = await Session.findOne({
      userId: existingUser._id,
    });
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id });
    }

    //Create a new session
    await Session.create({ userId: existingUser._id });
    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//user Logout
// exports.logout = async (req, res) => {
//   try {
//     const userId = req.id;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     await Session.deleteMany({ userId });

//     await User.findByIdAndUpdate(userId, {
//       isLoggedIn: false,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "User logged out successfully",
//     });
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
