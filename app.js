const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const recipeRouter = require("./routes/recipe.route");
const userRouter = require("./routes/user.route");

const { pageNotFound, serverNotFound } = require("./middlewares/handleErrors");

require('dotenv').config();

require('./config/db');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
// app.use(cors({origin:'http:// localhost:4200'})); 
app.use(cors());

app.get('/', (req, res) => {
  res.send("wellcome");
});

app.use("/recipes", recipeRouter);
app.use("/users", userRouter);

app.use(pageNotFound);
app.use(serverNotFound);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});