const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("../helper/init_redis");
const user = require("../models/user");
const { generateMailOptions } = require("../helper/emailOptions");
const { transporter } = require("../helper/emailConfig");
const {userEmail } = require("../templates/emailtemplates");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  // Check if request body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ isSuccess: false, message: "Request body is empty" });
  }

  try {
    if (!email || !name || !password) {
      return res.status(400).json({
        isSuccess: false,
        message: "Email, name, or password is missing in the request body",
      });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(201)
        .json({ isSuccess: false, message: "User Is Alredy Registered" });
    }

    const user = new User({ email, name, password });
    await user.save();
    transporter.sendMail(
      generateMailOptions(
        "peartalam@gmail.com",
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
    return res
      .status(200)
      .json({ isSuccess: true, message: "User Registered Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ isSuccess: false, error: error, message: "Registration failed" });
  }
};

//calculate access token expiration time
const tokenExpiration = new Date();
// tokenExpiration.setHours(tokenExpiration.getHours() + 1);
tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 2);

//calculate refresh token expiration time
// const refreshTokenExpiration = new Date();
// refreshTokenExpiration.setHours(refreshTokenExpiration.getHours() + 48);
const refreshTokenExpiration = new Date();
refreshTokenExpiration.setMinutes(refreshTokenExpiration.getMinutes() + 4);


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        isSuccess: false,
        error: "Authentication Failed",
        message: "Email or password is wrong",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        isSuccess: false,
        error: "Authentication failed",
        message: "Email or password is wrong",
      });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "50m" }
    );

    // Modified response object to include only email and name
    const userData = {
      email: user.email,
      name: user.name,
    };
    const responseData = { accessToken, refreshToken, user: userData ,tokenExpiration,refreshTokenExpiration};
    // await client.set("authKey", JSON.stringify(responseData), "EX", 86400); // Set the data with a 24-hour expiration
    // console.log("Value set successfully");

    // const value = await client.get("authKey");
    // const storedData = JSON.parse(value);

    res.status(200).json({
      isSuccess: true,
      //   data: { accessToken, refreshToken, user: userData },
      data: responseData,
      message: "Successfully logged in",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      isSuccess: false,
      error: "Authentication failed",
      message: "An internal server error occurred",
    });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) {
      return res
        .status(401)
        .json({
          isSuccess: false,
          error: "Invalid refresh token",
          message: "Invalid refresh token",
        });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, user) => {
        if (error) {
          return res
            .status(403)
            .json({
              isSuccess: false,
              error,
              message: "Invalid refresh token",
            });
        }

        const userInfo = await User.findOne({ _id: user.userId });
        if (!userInfo) {
          return res
            .status(403)
            .json({
              isSuccess: false,
              error: "User not found",
              message: "User not found",
            });
        }

        const newAccessToken = jwt.sign(
          { userId: user.userId },
          process.env.JWT_SECRET,
          { expiresIn: "2min" }
        );
        const newRefreshToken = jwt.sign(
          { userId: user.userId },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "4m" }
        );

        res.status(200).json({
          isSuccess: true,
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: userInfo,
          },
          message: "Successfully refreshed token",
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ isSuccess: false, error, message: "Authentication failed" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.user.userId; // Extract user ID from the token
  // const {userId }= req.body;
  const updateData = req.body; // Get the update data from the request body

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
};
