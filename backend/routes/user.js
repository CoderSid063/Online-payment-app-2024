const express = require("express");
const { User } = require("../models/userModel");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const authMiddleware = require("../middleware");
const Account = require("../models/accountModel");

//zod validation check:-
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

const updateBody = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
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

  const userId = dbUser._id;

  //giving user a rendom balance
  await Account.create({
    userId,
    balance: 1 + Math.random() * 1000,
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

//route for sign-in
router.post("/signin", async (req, res) => {
  const body = req.body;
  const { password } = req.body;
  const { success } = signinSchema.safeparse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect Input",
    });
  }

  const user = await User.findOne({
    username: body.username,
  });

  if (!user) {
    res.status(402).json({
      message: "user not exist",
    });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "password not valid",
    });
  }

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

//routes for update
router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeparse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne(req.body, {
    id: req.userId,
  });

  res.json({
    message: "Updated successfully",
  });
});

//route for get other user name from database
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      _id: user._id,
    })),
  });
});

module.exports = router;
