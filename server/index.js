import dotenv from "dotenv";
import express from "express";
import "./config/firebase.js";
import cors from "cors"
import notificationRoutes from "./routes/notificationRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use('/api/notifications', notificationRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
