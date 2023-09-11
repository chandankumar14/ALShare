const express = require("express")
const Router = express.Router()
const userController = require("../Controller/userDetails")


Router.get(`/userList`,userController.GetuserList);
module.exports  =  Router
