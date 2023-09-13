const express = require("express")
const Router = express.Router()
const userController = require("../Controller/video")

Router.post(`/video_details`,userController.PostVideoDetails);
Router.get(`/video_details_list`,userController.GetVideoDetails);
module.exports  =  Router
