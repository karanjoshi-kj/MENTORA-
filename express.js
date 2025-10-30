require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { StudentRouter } = require("./StudentRouter/index");
const { AdminRouter } = require("./AdminRouter/index");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
app.use("/student", StudentRouter);
app.use("/admin", AdminRouter);

// ✅ Default route for testing (important for Render)
app.get("/", (req, res) => {
  res.status(200).send("✅ Mentora Backend is Live on Render!");
});

// MongoDB + Server connection
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
  }
}

main();
