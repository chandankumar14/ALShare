const { $where } = require("../Model/user");
const videoDetailsModel = require("../Model/video");
const followingModel = require("../Model/following");
const likeComment = require("../Model/like_comment");
const reactionStatusModel = require("../Model/reactionStatus");
// ********Post Video Details in  video collection***********
exports.PostVideoDetail = async (req, res, next) => {
  const msg = req.body.videoStatus ? `Your video has been succesfully posted..` : `Your video has been successfully saved as draft`;
  const title = req.body.title;
  const description = req.body.description;
  const tags = req.body.tags;
  const link = req.body.link;
  const videoType = req.body.videoType;
  const videoSource = req.body.videoSource;
  const userId = req.body.userId;
  const videoStatus = req.body.videoStatus;
  const thumbnail = req.body.thumbnail;
  const likes = req.body.likes;
  const duration = req.body.duration;
  const avgRating = req.body.avgRating;
  const ratingUserCount = req.body.ratingUserCount;
  const videoDetail = new videoDetailsModel({
    title: title,
    description: description,
    tags: tags,
    link: link,
    videoType: videoType,
    videoSource: videoSource,
    userId: userId,
    videoStatus: videoStatus,
    thumbnail: thumbnail,
    likes: likes,
    duration: duration,
    avgRating: avgRating,
    ratingUserCount: ratingUserCount,
  });

  videoDetail
    .save()
    .then((result) => {
      res
        .status(200)
        .json({
          statusCode: 200,
          message: msg,
          user: result,

        });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
};
// **********Get All posted video*************
exports.GetVideoDetails = async (req, res, next) => {
  const userId = req.body.userId
  var followingList = await followingModel.find({ userId: userId });
  followingList = JSON.parse(JSON.stringify(followingList))
  videoDetailsModel.aggregate([{
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "videoOwner"
    }
  },
  {
    $lookup: {
      from: "favourites",
      localField: "_id",
      foreignField: "videoDetails",
      as: "favourites",
    }
  },
  {
    $project: {
      _id: 1,
      title: 1,
      description: 1,
      tags: 1,
      link: 1,
      videoType: 1,
      videoSource: 1,
      userId: 1,
      videoStatus: 1,
      likes: 1,
      thumbnail: 1,
      avgRating: 1,
      ratingUserCount: 1,
      duration: 1,
      createdAt: 1,
      updatedAt: 1,
      "videoOwner._id": 1,
      "videoOwner.Username": 1,
      "videoOwner.Email": 1,
      "favourites._id": 1,
      "favourites.userId": 1,
      "favourites.videoDetails": 1,
      "favourites.videoOwner": 1
    }
  }
  ])
    .sort({ _id: -1 })
    .then((result) => {
      result.map(item => {
        if (item.favourites) {
          const markAsFavourites = item.favourites.filter(items => items.userId == userId);
          if (markAsFavourites && markAsFavourites.length > 0) {
            item["favouritesStatus"] = true
          } else {
            item["favouritesStatus"] = false
          }
        } if (followingList) {
          const followingStatus = followingList.filter(item1 => item1.following == item.userId);
          if (followingStatus && followingStatus.length > 0) {
            item["followingstatus"] = true
          } else {
            item["followingstatus"] = false
          }
        }
      })
      res.status(200).json({
        statusCode: 200,
        message: "All Videos List ",
        Videos: result,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
};

// ************ Get All Save Videos*************

exports.GetSaveAndPostVideo = async (req, res, next) => {
  const userId = req.body.userId;
  const videoStatus = req.body.videoStatus;
  videoDetailsModel
    .find({ $and: [{ userId: userId }, { videoStatus: videoStatus }] })
    .then((result) => {
      res.status(200).json({
        statusCode: 200,
        message: "Posted Video Fetch Successfully",
        PostedVide: result,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
};

// ****************** Get All Followers user Videos **************
exports.GetFollowersVideos = async (req, res, next) => {
  const userId = req.body.userId
  const FollowingUserId = [];
  followingModel.find($where[{ userId: userId }]).select("userId").populate("following", "_id").limit(100).then(result => {
    result.map(item => {
      FollowingUserId.push(item.following._id)
    })
    if (FollowingUserId.length > 0) {
      videoDetailsModel.find({ userId: FollowingUserId }).then(result => {
        res.status(200).json({
          statusCode: 200,
          videos: result
        })
      }).catch(err => {
        res.status(401).json({
          statusCode: 401,
          message: err
        })
      })
    }
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: err
    })
  })
}

//****************Delete user draft or post video */
exports.DeleteUserVideo = async (req, res, next) => {
  const videoId = req.body.videoId;
  videoDetailsModel.findByIdAndDelete(videoId).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: ' Your video has been deleted successfully...',
      result: result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `somthing going wrong , please check...`
    })
  })
}
//************Post draft video********* */
exports.PostdraftVideo = async (req, res, next) => {
  const videoId = req.body.videoId;
  const videoStatus = true;
  videoDetailsModel.findByIdAndUpdate({ _id: videoId }, { videoStatus: videoStatus }, { new: true }).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: ` Your video is successfully posted...`,
      result: result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `somthing going wrong , please check..`
    })
  })
}
//**************user Reaction on video ********** */
exports.Reaction = async (req, res, next) => {
  const videoId = req.body.videoId;
  const userId = req.body.userId;
  const NAME = req.body.NAME;
  const CODE = req.body.CODE;
  const EMOOJI = req.body.EMOOJI;
  reactionStatusModel.find({ userId: userId, videoId: videoId }).then(result0 => {
    if (result0.length === 0) {
      const reactionStatusPayload = new reactionStatusModel({
        videoId: videoId,
        userId: userId,
        reactionStatus: true,
        code: CODE,
        name: NAME
      })
      reactionStatusPayload.save().then(result01 => {
        videoDetailsModel.find({ _id: videoId, reaction: { $elemMatch: { NAME: NAME, CODE: CODE } } }).then(result1 => {
          if (result1.length > 0) {
            videoDetailsModel.findOneAndUpdate({ _id: videoId, reaction: { $elemMatch: { NAME: NAME, CODE: CODE } } },
              { $inc: { "reaction.$.COUNT": 1 } }, { new: true })
              .then(result2 => {
                res.status(200).json({
                  statusCode: 200,
                  message: `you have reacted on a video`,
                  result: result2
                })
              }).catch(err => {
                res.status(401).json({
                  statusCode: 401,
                  message: `something going wrong please check and error is ${err}`
                })
              })
          } else {
            videoDetailsModel.findByIdAndUpdate(videoId, {
              $push: {
                reaction: {
                  NAME: NAME,
                  CODE: CODE,
                  COUNT: 1,
                  EMOOJI: EMOOJI
                }
              }
            }, { new: true }).then(result3 => {
              res.status(200).json({
                statusCode: 200,
                message: "you have reacted on a video",
                result: result3
              })
            }).catch(err => {
              res.status(401).json({
                statusCode: 401,
                message: `something going wrong please check and error is ${err}`
              })
            })
          }
        }).catch(err => {
          res.status(401).json({
            statusCode: 401,
            message: `something going wrong please check and error is ${err}`
          })
        })

      }).catch(err => {
        res.status(401).json({
          statusCode: 401,
          message: `something going wrong please check and error is ${err}`
        })
      })
    }
    if (result0.length > 0 && result0[0].code != CODE && result0[0].name != NAME) {
      reactionStatusModel.findOneAndUpdate({ userId: userId, videoId: videoId }, { code: CODE, name: NAME }).then(result4 => {
        videoDetailsModel.findOneAndUpdate({ _id: videoId, reaction: { $elemMatch: { NAME: result0[0].name, CODE: result0[0].code } } },
          { $inc: { "reaction.$.COUNT": -1 } }, { new: true })
          .then(result2 => {
            videoDetailsModel.findByIdAndUpdate(videoId, {
              $push: {
                reaction: {
                  NAME: NAME,
                  CODE: CODE,
                  COUNT: 1,
                  EMOOJI: EMOOJI
                }
              }
            }, { new: true }).then(result3 => {
              res.status(200).json({
                statusCode: 200,
                message: "you have reacted on a video",
                result: result3
              })
            }).catch(err => {
              res.status(401).json({
                statusCode: 401,
                message: `something going wrong please check and error is ${err}`
              })
            })
          }).catch(err => {
            res.status(401).json({
              statusCode: 401,
              message: `something going wrong please check and error is ${err}`
            })
          })
      }).catch(err => {
        res.status(401).json({
          statusCode: 401,
          message: `something going wrong please check and error is ${err}`
        })
      })
    }
    if (result0.length > 0 && result0[0].name === NAME && result0[0].code === CODE) {
      res.status(200).json({
        statusCode: 200,
        message: "this reaction is already saved..",
      })
    }
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `something going wrong please check and error is ${err}`
    })
  })
}
