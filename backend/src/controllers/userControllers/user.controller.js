const User = require("../../models/userModels/user.model");
const CustomError = require("../../utils/customError");
const bcrypt = require("bcrypt");
const cacheClient = require("../../services/cache.services");

const registerController = async (req, res, next) => {
  try {
    const { userName, email, mobile, address, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      userName,
      email,
      password,
      address,
      mobile,
    });

    console.log(newUser);

    // Call generateAuthToken on newUser instance
    const token = await newUser.generateAuthToken();
    console.log("Token inside register controller -->", token);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      // secure: true, // Required for sameSite "none" on modern browsers
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

const loginController = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return next(new CustomError("required fields missing", 400));
    const user = await User.authenticateUser(email, password);
    // console.log("user from logincontroller-->",user);

    const token = await user.generateAuthToken();
    console.log("this is my token from logincontroller-->", token);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure:true
    });

    
  //   const cookietoken=req.cookies;

  // console.log("ccokeii token-->",cookietoken.token)
    res.status(200).json({ message: "user logged in", token: token });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

const logoutController = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) return next(new CustomError("User unauthorised", 500));

    const blacklistToken = await cacheClient.set(
      token,
      "blacklisted",
      "EX",
      3600
    );

    res.clearCookie("token");
    res.status(200).json({
      message: "user logged out",
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

const currentUserController = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "authentication successfull", user: user });
  } catch (error) {}
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { userName, email, newpassword, address, mobile } = req.body;
     
    const user=await User.findOne({email});
    if(userName)user.userName=userName;
    if(email)user.email=email;
    if(address)user.address=address;
    if(mobile)user.mobile=mobile;

    let newToken=null;
    if(password){
      newToken=user.generateAuthToken();
      user.password=newpassword;
    }

    await user.save();
    if (!newToken)
      return next(new CustomError("error while generating new jwt token", 400));


    res.cookie("token",newToken);

  res.status(200).json({
      success: true,
      message: "Profile updated",
      user: user,
    });
  
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};


const resetPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) return next(new CustomError("Incorrect email", 400));

    const user = await user.findOne({ email });

    if (!user) return next(new CustomError("User not found", 404));

    const rawToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
      expiresIn: "10m",
    });

    const resetLink = `http://localhost/api/user/reset-password/${rawToken}`;

    const emailTemplate = resetPasswordTemplate(req.user.userName, resetLink);

    await sendMail("ddhote780@gmail.com", "Reset password", emailTemplate);

    res.status(200).json({
      success: true,
      message: "reset password link shared on your gmail",
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
module.exports = {
  registerController,
  loginController,
  logoutController,
  currentUserController,
  updateUserProfile,
  resetPasswordController

};
