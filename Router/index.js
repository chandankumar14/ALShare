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
Router.post(`/save_post_video`, videoController.GetSaveAndPostVideo);

//**********User Module section ***********
Router.post("/user_sign_up", userController.userSign_up);
Router.post("/otp_verification",userController.OTPVerification);
Router.post("sign_up_social_media",userController.SignUpWithSocialMedia)
Router.post("/user_login",userController.LoginUser);
Router.get("/all_user_list", userController.GetAllUserList);
Router.post("/user_by_id", userController.GetUserDetailsById);
Router.put("/edit_user_detail", userController.FindByIdAndUpdate);

// ************ Following and Followers Modules
Router.post("/follow", followersController.Follow);
Router.post("/following_list",followersController.GetFollowing)
Router.post("/follower_list",followersController.GetFollowers)
Router.post("/followers_videos",videoController.GetFollowersVideos)

module.exports = Router;
