const express = require("express");
const Router = express.Router();
const common = require("../Utilities/common")
// ******** All Video controller Section ************
const videoController = require("../Controller/video");
const ratingController = require("../Controller/rating")
const favouriteController = require("../Controller/favourite")
// ******** All User Controller section ****************
const userController = require("../Controller/user");

// ********** Following And Followers Controller *********
const followersController = require("../Controller/follower");

//********** Event controller ***** */
const eventController = require("../Controller/event")

//***********Payment Controller here ****** */
const paymentController = require("../Controller/payments")

// *********Vidoe Module **************
Router.post(`/video_details`, videoController.PostVideoDetail);
Router.post(`/video_details_list`, videoController.GetVideoDetails);
Router.post(`/save_post_video`, videoController.GetSaveAndPostVideo);
Router.post(`/post_draft_video`,videoController.PostdraftVideo)
Router.post(`/save_favorites_videos`,favouriteController.SaveFavouritesVideo)
Router.post(`/user_favourites_videos`,favouriteController.GetUserFavouritesVideos)
Router.post(`/delete_video_by_id`,videoController.DeleteUserVideo)
Router.post(`/delete_favourites_by_id`,favouriteController.DeleteFavouriteVideo)
Router.post(`/video_reaction`,videoController.Reaction)
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
//****************payment Integration**** */


//********** Event module Routing is here********* */

Router.post(`/create_event`, eventController.CreateEvent);
Router.get(`/All_event_list`,eventController.GetEventList);
Router.post(`/event_details_by_id`,eventController.GetEventById);
Router.post(`/post_event_video`,eventController.PostEventVideos);
Router.post(`/event_video_rating`,eventController.MarkEventVideoRating);
Router.post(`/event_video_reaction`,eventController.EventVideoReaction);
Router.post(`/event_video_list`,eventController.GetEventVideoList);
Router.post(`/draft_post_event_list`,eventController.GetPostAndDraftEvent);
Router.post(`/post_draft_event`,eventController.PostDraftEvent);
Router.post(`/replace_event_video`,eventController.ReplaceEventVideo);
Router.post(`/delete_draft_event`,eventController.DeleteDraftEvent);
//***********Payment Module is Here ********** */
Router.post(`/razorpay_create_order`, paymentController.CreateOrder);
Router.post(`/update_payment_status`,paymentController.updatePaymentStatus);
module.exports = Router;
