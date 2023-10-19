const { $where } = require("../Model/user");
const videoDetailsModel = require("../Model/video");
const followingModel = require("../Model/following");
const likeComment = require("../Model/like_comment")
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
  }, {
    $lookup: {
      from: "like_commnents",
      localField: "_id",
      foreignField: "videoDetails",
      as: "like",
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
      duration: 1,
      createdAt: 1,
      updatedAt: 1,
      "videoOwner._id": 1,
      "videoOwner.Username": 1,
      "videoOwner.Email": 1,
      "like._id": 1,
      "like.userId": 1,
      "like.videoDetails": 1,
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
        if (item.like) {
          const UserLiked = item.like.filter(items => items.userId == userId)
          if (UserLiked && UserLiked.length > 0) {
            item["likeStatus"] = true
          } else {
            item["likeStatus"] = false
          }
        }
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

// ************** like  video*************
exports.LikeVideo = async (req, res, next) => {
  const _id = req.body._id;
  const userId = req.body.userId;
  const likeStatus = await likeComment.find({ $and: [{ videoDetails: _id }, { userId: userId }] });
  if (likeStatus && likeStatus.length === 0) {
    const likeCommentpayload = new likeComment({
      userId: userId,
      videoDetails: _id,
      like: true
    })
    likeCommentpayload.save().then(result => {
      videoDetailsModel.findOneAndUpdate({ _id: _id }, { $inc: { likes: 1 } }, { new: true }).then(result => {
        res.status(200).json({
          statusCode: 200,
          message: `You are liking a video `,
          video: result,
          like: true
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
    res.status(401).json({
      statusCode: 401,
      message: `sorry can't like `,
      like: false
    })
  }
}
// ************ unlike video*********
exports.unLikeVideo = async (req, res, next) => {
  const userId = req.body.userId
  const _id = req.body._id;
  const likeStatus = await likeComment.find({ $and: [{ videoDetails: _id }, { userId: userId }] });
  if (likeStatus && likeStatus.length > 0) {
    likeComment.findOneAndDelete({ $and: [{ userId: userId }, { videoDetails: _id }] }).then(resul => {
      videoDetailsModel.findOneAndUpdate({ _id: _id, likes: { $gte: 1 } }, { $inc: { likes: -1 } }, { new: true }).then(result => {
        res.status(200).json({
          statusCode: 200,
          message: `You are unliking a video `,
          unlike: true,
          video: result
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
    res.status(401).json({
      statusCode: 401,
      message: `sorry can't unlike`,
      unlike: false
    })
  }
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