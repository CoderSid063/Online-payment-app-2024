const express = require(express);
const router = express.Router();
const userRouter = require("../routes/user");

router.use("/user", userRouter);

module.exports = router;
