import dotenv from "dotenv";

import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/utilis/ApiError.js";
import cors from "cors";

const app = express();

// dotenv configuration
dotenv.config({
  path: "./.env",
});

// cors middleware configuration connects frontend to backend
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import routes
import userRouter from "./src/routes/user.routes.js";
import doctorRouter from "./src/routes/doctor.routes.js";
import appointmentRouter from "./src/routes/appointment.routes.js";
import opdScheduleRouter from "./src/routes/opdSchedule.route.js";
import bedRouter from "./src/routes/bed.routes.js";
// import medicineRouter from "./src/routes/medicine.routes.js";
// import PaymentRouter from "./src/routes/payment.routes.js";
// import TestimonialRouter from "./src/routes/testimonial.routes.js";

// Define the root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the homepage!');
// });

// routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/opdSchedule", opdScheduleRouter);
app.use("/api/v1/bed", bedRouter);
// app.use("/api/v1/medicines", medicineRouter);
// app.use("/api/v1/medicines-cart", CartRouter)
// app.use("/api/v1/payment", PaymentRouter)
// app.use("/api/v1/testimonial", TestimonialRouter)


// error middleware
app.use(errorHandler);
export default app;
