const express = require("express");
const cors = require("cors");
const { connectDB } = require("./database.js");

const app = express();

connectDB();

app.use(cors());

app.use(express.static("public"));

app.use(express.json({ limit: "15kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

const mainRouter = require("./routes/index.js");

app.use("api/v1", mainRouter);
// app.use("api/v1", v2Router);

app.listen(3000);
