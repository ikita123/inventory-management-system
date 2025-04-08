// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redisClient");
const { connectRabbitMQ } = require("./config/rabbitmq");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
};

startServer();
