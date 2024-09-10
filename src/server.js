import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './config/configViewEngine';
import initWebRount from './rounter/web';
import connectDB from './config/connectDB';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { insertMedicine } from './services/medicineService';

const app = express();

const corsOptions = {
    origin: "http://localhost:5173", // Chỉ cho phép yêu cầu từ URL được xác định trong REACT_URL
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE', // Các phương thức yêu cầu muốn cho phép
    allowedHeaders: 'X-Requested-With, content-type, Authorization', // Các header  muốn cho phép
    credentials: true // Cho phép gửi cookie cùng với yêu cầu
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// Initialize cookie parser

app.use(cookieParser());

// Configure view engine

configViewEngine(app);

// Initialize web routes

initWebRount(app);

connectDB();

let PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;