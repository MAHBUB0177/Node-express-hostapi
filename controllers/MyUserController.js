const User = require("../models/user");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');
const client = require("../helper/init_redis");
const user = require("../models/user");
const { generateMailOptions } = require("../helper/emailOptions");
const { transporter } = require("../helper/emailConfig");
const {userEmail } = require("../templates/emailtemplates");
const { uploadSingleImage } = require("./MyFileUploadControllers");



const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ isSuccess: false, message: "Missing fields" });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(201).json({ isSuccess: false, message: "User already registered" });
    }


    const user = new User({ email, name, password });
    await user.save();
        transporter.sendMail(
      generateMailOptions(
        "mahbub15-9283@diu.edu.bd",
        "User Registration Mail",
        "",
        userEmail(name, password)
      ),
      (error, info) => {
        if (error) {
          console.error("Error occurred while sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      }
    );

    res.status(200).json({ isSuccess: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ isSuccess: false, message: "Internal server error" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body,'req.body=========')

  if (!email || !password) {
    return res.status(400).json({ isSuccess: false, message: "Missing fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid credentials",
        error: "Authentication Failed",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid credentials",
        error: "Authentication failed",
      });
    }
    // Calculate token expiration times
    const accessTokenExpirationTime = 20; // Access token lifespan in minutes
    const refreshTokenExpirationTime = 5 * 60; // Refresh token lifespan in minutes (5 hours = 300 minutes)

    // const now = new Date();
    // const tokenExpiration = new Date(now.getTime() + accessTokenExpirationTime * 60 * 1000); // Current time + 2 minutes
    // const refreshTokenExpiration = new Date(now.getTime() + refreshTokenExpirationTime * 60 * 1000); // Current time + 5 minutes

    //wt get 2 argumnet to create accesstoken(payload,secret,options)
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: `${accessTokenExpirationTime}m` } // Set token lifespan 
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: `${refreshTokenExpirationTime}m` } // Set token lifespan
    );

    res.status(200).json({
      isSuccess: true,
      data: {
        accessToken,
        refreshToken,
        accessTokenExpirationTime: `${accessTokenExpirationTime} minutes`,
        refreshTokenExpirationTime: `${refreshTokenExpirationTime / 60} hours`, // Convert to hours for response
        user: { email: user.email, name: user.name },
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ isSuccess: false, message: "Internal server error" });
  }
};
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    // Validate the presence of refreshToken
    if (!refreshToken) {
      return res.status(401).json({
        isSuccess: false,
        error: "Invalid refresh token",
        message: "Refresh token is missing",
      });
    }

    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          return res.status(403).json({
            isSuccess: false,
            error,
            message: "Refresh token is invalid or expired",
          });
        }

        // Check if refresh token has expired
        const now = new Date();
        const refreshTokenExpiration = new Date(decoded.exp * 1000); //refreshtoken `exp` in JWT payload is in seconds
        if (now >= refreshTokenExpiration) {
          return res.status(403).json({
            isSuccess: false,
            error: "Refresh token expired",
            message: "Refresh token has expired",
          });
        }

        // Retrieve user information
        const userInfo = await User.findOne({ _id: decoded.userId });
        if (!userInfo) {
          return res.status(404).json({
            isSuccess: false,
            error: "User not found",
            message: "User associated with the token not found",
          });
        }

        // Generate new tokens
        const newAccessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.JWT_SECRET,
          { expiresIn: "20m" } // Access token lifespan
        );
        // const newRefreshToken = jwt.sign(
        //   { userId: decoded.userId },
        //   process.env.REFRESH_TOKEN_SECRET,
        //   { expiresIn: "5m" } // Refresh token lifespan
        // );

        res.status(200).json({
          isSuccess: true,
          data: {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            user: { email: userInfo.email, name: userInfo.name },
          },
          message: "Tokens refreshed successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error in refreshing token:", error);
    res.status(500).json({
      isSuccess: false,
      error: "Internal server error",
      message: "Failed to refresh token",
    });
  }
};

const updateUser = async (req, res) => {
  const userId = req.user.userId; // Extract user ID from the token
  // const {userId }= req.body;
  const updateData = req.body; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    // Update the user's information
    Object.assign(user, updateData);
    await user.save();

    res
      .status(200)
      .json({
        isSuccess: true,
        data: user,
        message: "User updated successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        isSuccess: false,
        error: error.message,
        message: "Failed to update user",
      });
  }
};


const createMyProfileImage = async (req, res) => {
  try {
      // Check if a file was uploaded
      if (!req.file) {
          return res.status(400).json({ isSuccess: false, message: "No file uploaded" });
      }
      // Upload the single image and get the URL
      const imageUrl = await uploadSingleImage(req.file);
      res.status(201).json({ isSuccess: true, message: "Image added successfully", image: imageUrl });
  } catch (error) {
      console.error("Error creating background image:", error);
      res.status(500).json({ isSuccess: false, error, message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  const userId = req.user.userId; // Extract user ID from the token
  const { oldPassword, Password } = req.body; // Extract passwords from the request body
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    // Check if the old password matches the stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Old password is incorrect" });
    }
    user.password = Password;
    await user.save();
    res.status(200).json({
      isSuccess: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: error.message,
      message: "Failed to reset password",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();
    const result = await User.deleteOne({ _id: id });
    res
      .status(200)
      .json({
        isSuccess: true,
        data: result,
        message: "User delete successfully",
      });
  } catch (error) {
    res
      .status(404)
      .json({ isSuccess: false, error: error, message: "Please try again" });
  }
};

const currentuserInfo = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId);
  try {
    if (!user) {
      res.status(404).json({ isSuccess: false, message: "user not found" });
    }
    res
      .status(200)
      .json({ isSuccess: true, message: "user found", user: user });
  } catch (error) {
    res
      .status(500)
      .json({
        isSuccess: false,
        message: "something went wrong",
        error: error,
      });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  updateUser,
  deleteUser,
  currentuserInfo,
  resetPassword,
  createMyProfileImage
};
