const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    method: "GET, POST, PUT, DELETE, PATCH, HEAD",
    Credential: true,
  })
);

app.use(express.json({ limit: "15kb" }));

const mainRouter = require("./routes/index.js");

app.use("api/v1", mainRouter);
app.use("api/v1", v2Router);

app.listen(3000);
