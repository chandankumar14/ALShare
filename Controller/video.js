const videoDetailsModel = require("../Model/video");
const videoDetailModel =require("../Model/videos")
// Post Video Details in  video collection
exports.PostVideoDetails = async (req, res, next) => {
  const title = req.body.title;
  const description=  req.body.description;
  const tags=  req.body.tags;
  let videoDetailsData = new videoDetailsModel({
    title:title,
    description:description,
    tags:tags
})
  const videoDetails = await videoDetailsData.save();
  if (!videoDetails) {
    res.status(404).json({
      message: "somthing going wrong , please check ",
    });
  } else {
    res.status(200).json({
      message: "video details  posted successfully ",
      videoDetails: videoDetails,
     });
  }
};

exports.GetVideoDetails = async (req, res, next) => {
  const videoDetails = await videoDetailsModel.find();
  if (!videoDetails) {
    res.status(404).json({
      message: "somthing going wrong , please check ",
    });
  } else {
    res.status(200).json({
      message: "video details  posted successfully ",
      videoDetails: videoDetails,
     });
  }
};


exports.PostVideoDetail = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const tags = req.body.tags;
  const link = req.body.link;
  const videoType = req.body.videoType;
  const videoSource = req.body.videoSource;
  const userId = req.body.userId;
  const videoDetail = new videoDetailModel({
    title: title,
    description: description,
    tags: tags,
    link: link,
    videoType: videoType,
    videoSource: videoSource,
    userId: userId,
  });

  const videoDetailResponse = videoDetail.save();
  if (!videoDetailResponse) {
    res.status(404).json({
      message: "somthing going wrong , please check ",
      status: "404",
    });
  } else {
    res.status(200).json({
      message: "video details  posted successfully ",
      videoDetails: videoDetailResponse,
      statusCode: "200",
    });
  }
};


