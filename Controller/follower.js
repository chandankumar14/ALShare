const followers = require("../Model/followers");

exports.Follow = async (req, res, next) => {
  const userId = req.body.userId;
  const followingId = req.body.followingId;
  const followersPyload = new followers({
    userId: userId,
    followers: followingId,
  });

  await followers
    .find({ userId: userId })
    .then((result) => {
      if (result != undefined && result.length === 0) {
        console.log("if block")
        followersPyload
          .save()
          .then((result) => {
            res.status(200).json({
              message: "following success",
              result: result,
            });
          })
          .catch((err) => {
            res.status(401).json({
              message: err,
            });
          });
      } else {
        followers
          .findById(userId, {
            $push: {
              followers: followingId,
            },
          })
          .then((result) => {
            res.status(200).json({
              message: "following success",
              result: result,
            });
          })
          .catch((err) => {
            res.status(401).json({
              message: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
