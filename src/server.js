import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Server } from "socket.io";
import http from "http";
import jwt from 'jsonwebtoken';

import configViewEngine from './config/configViewEngine';
import initAdminRoute from "./router/admin";
import initDoctorRoute from "./router/doctor";
import connectDB from './config/connectDB';
import initWebAuthenRounte from './router/webAuthen';
import authenRoute from './router/authen';
import initWebRounte from './router/web';
import { emitNewDateTicket, registerUserSocket, removeUserSocket } from './services/socketService';
import initNotificationRoute from './router/notification';
import dotenv from 'dotenv';
import { paymentMomoCallback } from './services/paymentService';
dotenv.config();

const app = express();
const server = http.createServer(app);
const corsOptions = {
    origin: process.env.REACT_APP_BACKEND_URL,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: 'X-Requested-With, content-type, Authorization',
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// Cấu hình express-session
app.use(
    session({
        secret: process.env.SECRET_SESSION, // Key để mã hóa session
        resave: false, // Không lưu lại session nếu không thay đổi
        saveUninitialized: true, // Lưu session ngay cả khi chưa khởi tạo
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport setup (cấu hình Google OAuth)
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    )
);

// Serialize & Deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Initialize cookie parser
app.use(cookieParser());

// Configure view engine
configViewEngine(app);

// Khởi tạo Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP_BACKEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Xử lý kết nối Socket.io
io.on('connection', (socket) => {

    socket.on('authenticate', async (token) => {
        try {
            const pureToken = token.replace('Bearer ', '');
            const cookieHeader = socket.handshake.headers.cookie;

            // Nếu muốn parse cookie:
            const parsedCookies = cookieHeader?.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = decodeURIComponent(value);
                return acc;
            }, {}) || {};

            const refreshToken = parsedCookies['refreshToken'];
            if (!refreshToken) {
                return socket.emit('error', 'No refresh token found');
            }

            const decoded = jwt.verify(refreshToken, process.env.SECURITY_KEY);

            const userId = decoded.id;
            // Đăng ký socket cho người dùng
            registerUserSocket(socket, userId);

            // Setup xử lý khi ngắt kết nối
            socket.on('disconnect', () => {
                removeUserSocket(userId);
            });
        } catch (error) {
            console.error('Authentication error:', error);
        }
    });

});


// Khởi tạo các chức năng socket
emitNewDateTicket(io);
// Initialize web routes
authenRoute(app, passport);
initWebRounte(app);
initWebAuthenRounte(app);
initAdminRoute(app);
initDoctorRoute(app);
initNotificationRoute(app);

connectDB();

let PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

export { io };
export default app;