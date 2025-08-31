import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({
    limit: '50kb',
}));

app.use(express.urlencoded({
    extended: true,
    limit: '50kb',
}));

app.use(express.static("public"))

app.use(cookieParser())


// Routes importing
import userRoute from "./routes/user.route.js"

// Routes declaring
app.use("/api/v1/users",userRoute)

export default app;