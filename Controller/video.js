const { $where } = require("../Model/user");
const videoDetailsModel = require("../Model/video");
// ********Post Video Details in  video collection***********
exports.PostVideoDetail = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const tags = req.body.tags;
  const link = req.body.link;
  const videoType = req.body.videoType;
  const videoSource = req.body.videoSource;
  const userId = req.body.userId;
  const publish = req.body.publish;
  const thumbnail = req.body.thumbnail
  const videoDetail = new videoDetailsModel({
    title: title,
    description: description,
    tags: tags,
    link: link,
    videoType: videoType,
    videoSource: videoSource,
    userId: userId,
    publish: publish,
    thumbnail:thumbnail
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
    .find()
    .populate("userId", `Username Email password`)
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
  const publish = req.body.publish;
  videoDetailsModel
    .find($where[{ userId: userId }])
    .and({ publish: publish })
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
