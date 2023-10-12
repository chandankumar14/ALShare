const express = require("express");
require("dotenv").config();
const PORT_NO = process.env.PORT_NO;
const API_URL = process.env.API_URL;
const Router  = require("./Router/index")
let HOST_NO = process.env.HOST;
const mongoose = require("mongoose");
var cors = require("cors");
const bodyParser = require("body-parser");
let DB_CONNECTION = process.env.CONNECTION_STRING;
const App = express();
App.use(cors());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended:true}))
App.use(`/${API_URL}/`,express.static("user_profile_image"))
//************Routing Configuration is Here ************* */
App.use(`/${API_URL}/`, Router);
// *************DataBase connect is Here*************
mongoose
  .connect(DB_CONNECTION, { dbName: "ALShare" })
  .then(
    App.listen(PORT_NO, HOST_NO, () => {
      console.log(`Server running at http://${HOST_NO}:${PORT_NO}/`);
    }),
    console.log("********DataBase is Connected successFully ***********")
  )
  .catch((err) => {
    console.log(err);
  });
