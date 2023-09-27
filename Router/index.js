const express = require("express");
const Router = express.Router();
// ******** All Video controller Section ************
const videoController = require("../Controller/video");
// ******** All User Controller section ****************
const userController = require("../Controller/user");

// ********** Following And Followers Controller *********
const followersController = require("../Controller/follower");

// *********Vidoe Module **************
Router.post(`/video_details`, videoController.PostVideoDetail);
Router.get(`/video_details_list`, videoController.GetVideoDetails);
Router.post(`/posted_video_by_userId`, videoController.GetPostVideo);
Router.post(`/save_video_by_userId`, videoController.GetSaveVideo);

//**********User Module section ***********
Router.post("/user_sign_up", userController.userSignUp);
Router.post("/user_login",userController.LoginUser)
Router.get("/all_user_list", userController.GetAllUserList);
Router.post("/user_by_id", userController.GetUserDetailsById);
Router.put("/edit_user_detail", userController.FindByIdAndUpdate);

// ************ Following and Followers Modules
Router.post("/follow", followersController.Follow);

module.exports = Router;
