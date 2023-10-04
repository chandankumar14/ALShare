const userModule = require("../Model/user")
const followersModel = require("../Model/followers")
const followingModel = require("../Model/following")
// *******Follow the new User *******************
exports.Follow = async (req, res, next) => {
  const followingId = req.body.followingId;
  const _id = req.body._id;
  followingModel.find({ $and: [{ userId: _id }, { following: followingId }] }).then(result => {
    if (result != undefined && result.length === 0) {
      const followingPayload = new followingModel({
        userId: _id,
        following: followingId,
      })
      followingPayload.save().then(result => {
        const followersPayload = new followersModel({
          userId: followingId,
          followers: _id,
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
  followingModel.find({ userId: userId}).populate("following", "-password").then(result => {
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
  followersModel.find({ userId: userId }).populate("followers", "-password").limit(100).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: "All Followers List ....",
      result: result,
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: err
    })
  })
}

exports.unFollowUser = async (req, res, next) => {
  const userId = req.body.userId;
  const unFollowingId = req.body.unFollowingId;
  followingModel.findOneAndDelete({ $and: [{ userId: userId }, { following: unFollowingId }] }).then(result => {
    followersModel.findOneAndDelete({ $and: [{ userId: unFollowingId }, { followers: userId }] }).then(result1 => {
      res.status(200).json({
        statusCode: 200,
        message: `you are unfollowing  ${unFollowingId} successfully`
      })
    }).catch(err => {
      res.status(401).json({
        statusCode: 401,
        message: `somthing going wrong`
      })
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `somthing going wrong`
    })
  })
}