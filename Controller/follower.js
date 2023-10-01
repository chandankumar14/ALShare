const userModule = require("../Model/user")
const followers = require("../Model/followers")
const following = require("../Model/following")
// *******Follow the new User *******************
exports.Follow = async (req, res, next) => {
  const followingId = req.body.followingId;
  const _id = req.body._id;
  following.find({ $and: [{ userId: _id }, { following: followingId }] }).then(result => {
    if (result != undefined && result.length === 0) {
      const followingPayload = new following({
        userId: _id,
        following: followingId
      })
      followingPayload.save().then(result => {
        const followersPayload = new followers({
          userId: followingId,
          followers: _id
        })
        followersPayload.save().then(result => {
          res.status(200).json({
            statusCode: 200,
            message: `you are following successfully`,
            result: result
          })
        }).catch(err => {
          res.status(401).json({
            statusCode: 401,
            message: err
          })
        })
      }).catch(err => {
        res.status(401).json({
          statusCode: 401,
          message: err
        })
      })
    } else {
      res.status(200).json({
        statusCode: 200,
        message: `you are already following..`
      })
    }
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: err
    })
  })
};

// ********** Get All following user list***********
exports.GetFollowing = async (req, res, next) => {
  const userId = req.body._id;
  following.find({ userId: userId }).populate("following", "-password").then(result => {
    res.status(200).json({
      statusCode: 200,
      message: "All following user.....",
      result: result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: err
    })
  })
}

// *************** Get All follower List ************ 

exports.GetFollowers = async (req, res, next) => {
  const userId = req.body._id;
  followers.find({ userId: userId }).populate("followers", "-password").then(result => {
    res.status(200).json({
      statusCode: 200,
      message: "All Followers List ....",
      result: result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: err
    })
  })
}