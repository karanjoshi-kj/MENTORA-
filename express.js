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
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/student", StudentRouter);
app.use("/admin", AdminRouter);

// Test route (for Render testing)
app.get("/", (req, res) => {
  res.send("Mentora backend is live and working ✅");
});

// Database + Server connection
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("❌ Connection Problem Encountered:", e);
  }
}

main();
