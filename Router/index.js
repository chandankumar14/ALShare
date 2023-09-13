const express = require("express")
const Router = express.Router()
const userController = require("../Controller/video")

Router.post(`/video_details`,userController.PostVideoDetails);
module.exports  =  Router
