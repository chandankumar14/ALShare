const userDetails = require("../Model/userDetails");
// Get ALL User List  form user collection
exports.GetuserList = async (req, res, next) => {
  const userList = await userDetails.find();
  if (!userList) {
    res.status(404).json({
      message: "user not found or somthing going wrong",
    });
  } else {
    res.status(200).json({
      message: "user fetch successfully ",
      userList: userList,
     });
  }
};
