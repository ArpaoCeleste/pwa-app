const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path");
const socketIo = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const config = require("./config");
const port = process.env.PORT || 5000;
const hostname = ("RENDER" in process.env) ? "0.0.0.0" : "localhost"; 

mongoose.connect(process.env.MONGO_URI || config.db)
  .then(() => console.log('Connection successful!'))
  .catch((err) => console.error(err));

let router = require('./router');

var app = express();

const customFrontendUrl = process.env.FRONTEND_URL || '';

const allowedOrigins = [
  customFrontendUrl,
  'https://pwa-app-sigma-lovat.vercel.app/',
].filter(Boolean);

const isAllowedOrigin = (origin) =>
  !origin || allowedOrigins.includes(origin);

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));



module.exports = app;