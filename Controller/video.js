const { $where } = require("../Model/user");
const videoDetailsModel = require("../Model/video");
const followingModel = require("../Model/following");
// ********Post Video Details in  video collection***********
exports.PostVideoDetail = async (req, res, next) => {
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
    duration: duration
  });

  videoDetail
    .save()
    .then((result) => {
      res
        .status(200)
        .json({
          statusCode: 200,
          message: " video posted successfull",
          user: result,

        });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
};

// **********Get All posted video*************
exports.GetVideoDetails = async (req, res, next) => {
  videoDetailsModel
    .find({})
    .populate("userId", `Username Email Avatar`)
    .then((result) => {
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

exports.LikeVideo = async (req, res, next) => {
  const _id = req.body._id;
  videoDetailsModel.findOneAndUpdate({ _id: _id }, { $inc: { likes: 1 } }, { new: true }).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: `you are liking video `,
      video: result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: err
    })
  })
}

exports.unLikeVideo = async (req, res, next) => {
  const _id = req.body._id;
  videoDetailsModel.findOneAndUpdate({ _id: _id, likes: { $gte: 1 } }, { $inc: { likes: -1 } }, { new: true }).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: `you are unliking video `,
      video: result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: err
    })
  })
}

exports.DeleteUserVideo = async (req, res, next) => {
  const videoId = req.body.videoId;
  videoDetailsModel.findByIdAndDelete(videoId).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: 'video has been deleted...',
      result:result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `somthing going wrong , please check...`
    })
  })
}

exports.PostdraftVideo = async(req,res,next)=>{
  const videoId = req.body.videoId;
  const videoStatus = true;
  videoDetailsModel.findByIdAndUpdate({_id:videoId},{videoStatus:videoStatus},{new:true}).then(result=>{
    res.status(200).json({
      statusCode:200,
      message:` your draft video is posted successfully...`,
      result:result
    })
  }).catch(err=>{
    res.status(401).json({
      statusCode:401,
      message:`somthing going wrong , please check..`
    })
  })
}