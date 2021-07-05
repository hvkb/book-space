const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const connectDB = require("./server/database/connection");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

//mongodb connections
connectDB();

//MIDDLEWARE
app.use(bodyparser.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());
//set view engine
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(cors());

//load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//load routers
app.use("/", require("./server/routes/router"));
