const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require('dotenv').config();

require('./config/db');


const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(morgan("dev")); 
// app.use(cors({origin:'http:// localhost:4200'})); // אפשור רק לכתובת מסוימת
app.use(cors()); 