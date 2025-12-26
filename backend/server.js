require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const searchRoute = require("./routes/search");

const app = express();
app.use(cors());
app.use("/search", searchRoute);
app.use("/uploads", express.static("uploads"));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
