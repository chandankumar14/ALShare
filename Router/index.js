const express = require("express");
const Router = express.Router();
const common = require("../Utilities/common")
// ******** All Video controller Section ************
const videoController = require("../Controller/video");
const ratingController = require("../Controller/rating_reaction")
const favouriteController = require("../Controller/favourite")
// ******** All User Controller section ****************
const userController = require("../Controller/user");

// ********** Following And Followers Controller *********
const followersController = require("../Controller/follower");

// *********Vidoe Module **************
Router.post(`/video_details`, videoController.PostVideoDetail);
Router.post(`/video_details_list`, videoController.GetVideoDetails);
Router.post(`/save_post_video`, videoController.GetSaveAndPostVideo);
Router.post(`/video_like`, videoController.LikeVideo);
Router.post(`/post_draft_video`,videoController.PostdraftVideo)
Router.post(`/video_unlike`,videoController.unLikeVideo)
Router.post(`/video_like`,videoController.LikeVideo)
Router.post(`/save_favorites_videos`,favouriteController.SaveFavouritesVideo)
Router.post(`/user_favourites_videos`,favouriteController.GetUserFavouritesVideos)
Router.post(`/delete_video_by_id`,videoController.DeleteUserVideo)
Router.post(`/delete_favourites_by_id`,favouriteController.DeleteFavouriteVideo)
//**********User Module section ***********
Router.post("/user_sign_up", userController.userSign_up);
Router.post("/otp_verification",userController.OTPVerification);
Router.post("sign_up_social_media",userController.SignUpWithSocialMedia)
Router.post("/user_login",userController.LoginUser);
Router.get("/all_user_list", userController.GetAllUserList);
Router.post("/user_by_id", userController.GetUserDetailsById);
Router.put("/edit_user_detail",common.upload_profile_image.single("profile_image"), userController.FindByIdAndUpdate);
Router.post("/log_out",userController.LogoutUser)

// ************ Following and Followers Modules
Router.post("/follow", followersController.Follow);
Router.post("/unfollow", followersController.unFollowUser)
Router.post("/following_list",followersController.GetFollowing)
Router.post("/follower_list",followersController.GetFollowers)
Router.post("/followers_videos",videoController.GetFollowersVideos)
Router.post("/following_status",followersController.userStatus)

//************ Rating section is here********* */
Router.post("/mark_video_rating",ratingController.MarkVideoRating);
Router.post("/video_details_by_userId_and_videoId",ratingController.GetRatedvideo)

module.exports = Router;
