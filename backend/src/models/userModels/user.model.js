const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    maxLength: 10,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
   isAdmin: { type: Boolean, default: false },
},
 {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  console.log("token--->", token);

  if (!token) throw new Error("error generating token ");
  return token;
};

userSchema.statics.authenticateUser = async function (email, password) {
  const user = await this.findOne({ email });
  console.log("obj user----->", user);
  if (!user) throw new Error("User not found ");

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("ismatch from aunticatuser-->",isMatch)
  console.log("pass->", isMatch);
  if (!isMatch) throw new Error("incorrect email or password ");

  return user;
};

module.exports = mongoose.model("User", userSchema);