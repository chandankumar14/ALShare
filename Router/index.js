const express = require("express");
const Router = express.Router();
// ******** All Video controller Section ************
const videoController = require("../Controller/video");
// ******** All User Controller section ****************
const userController = require("../Controller/user");
// *********Vidoe Module **************
Router.post(`/video_details`, videoController.PostVideoDetails);
Router.get(`/video_details_list`, videoController.GetVideoDetails);
//**********User Module section ***********
Router.post("/user_sign_up", userController.userSignUp);
Router.get("/all_user_list", userController.GetAllUserList);
Router.post("/user_by_id", userController.GetUserDetailsById);
Router.put("/edit_user_detail", userController.FindByIdAndUpdate);

module.exports = Router;
