const express = require("express");
const { User } = require("../models/userModel");
const router = express.Router();
const zod = requiire("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

const signupSchema = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

//route for signup
router.post("/signup", async (req, res) => {
  const body = rq.body;
  const { success } = signupSchema.safeparse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Email already taken/ Incorrect input",
    });
  }

  const user = await User.findOne({
    username: body.username,
  });

  if (user._id) {
    res.status(411).json({
      message: "Email already taken",
    });
  }

  const dbUser = await User.create({
    username: body.username,
    password: body.password,
    firstname: body.firstname,
    lastname: body.lastname,
  });

  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});
