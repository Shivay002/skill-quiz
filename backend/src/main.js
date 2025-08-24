import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB, sequelize } from "./config/db.js";
// import authRoutes from "./routes/auth.routes.js";
import questionRoutes from "./routes/questions.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import reportRoutes from "./routes/report.routes.js";
import skillRoutes from "./routes/skills.routes.js";
import userRoutes from "./routes/users.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/quiz", quizRouter);

app.get("/health", (req, res) => res.json({ status: "OK" }));
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connection established");
    await sequelize.sync({ alter: false });
    console.log("✅ All models synchronized with DB");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
