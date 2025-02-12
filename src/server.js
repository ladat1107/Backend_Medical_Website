import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import configViewEngine from './config/configViewEngine';
import initAdminRoute from "./router/admin"
import initDoctorRoute from "./router/doctor"
import connectDB from './config/connectDB';
import initWebAuthenRounte from './router/webAuthen';
import authenRoute from './router/authen';
import initWebRounte from './router/web';
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: process.env.REACT_APP_BACKEND_URL, // Chỉ cho phép yêu cầu từ URL được xác định trong REACT_URL
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

// Cấu hình express-session
app.use(
    session({
        secret: process.env.SECRET_SESSION, // Một chuỗi bí mật dùng để mã hóa session
        resave: false, // Không lưu lại session nếu không thay đổi
        saveUninitialized: true, // Lưu session ngay cả khi chưa khởi tạo
    })
);

app.use(passport.initialize());
app.use(passport.session()); // Sử dụng session để lưu trữ phiên

// Passport setup (cấu hình Google OAuth)
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // Thông tin người dùng nhận từ Google ==> console.log('Google Profile:', profile);
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

// Initialize web routes
authenRoute(app,passport);

initWebRounte(app);
initWebRounte(app);
initWebAuthenRounte(app);
initAdminRoute(app);
initDoctorRoute(app)

connectDB();

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//insertGroup();

export default app;