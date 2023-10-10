const favouriteModel = require("../Model/favourite")

exports.SaveFavouritesVideo = async (req, res, next) => {
    const userId = req.body.userId;
    const videoId = req.body.videoId;
    const videoOwnerId = req.body.videoOwnerId;
    const favouritePayload = new favouriteModel({
        userId: userId,
        videoDetails: videoId,
        videoOwner: videoOwnerId
    })
    favouritePayload.save().then(result => {
        res.status(200).json({
            statusCode: 200,
            message: `this video is saved as favourite`
        })
    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `please check, somthing going wrong, err is ${err}`
        })
    })
}

exports.GetUserFavouritesVideos = async (req, res, next) => {
    const userId = req.body.userId;
    favouriteModel.find({ userId: userId }).populate("videoDetails", `-userId`).populate("videoOwner", `-password`).then(result => {
        res.status(200).json({
            statusCode:200,
            message:`user favourites video list fetch successfully..`,
            result:result
        })
    }).catch(err => {
        res.status(401).json({
            statusCode:401,
            message:`somthing going wrong , please ceck . err is ${err}`
        })
    })
}

exports.DeleteFavouriteVideo = async (req, res, next) => {
    const videoId = req.body.videoId;
    favouriteModel.findOneAndDelete({videoDetails:videoId}).then(result => {
        res.status(200).json({
            statusCode: 200,
            message: 'favourites video has been deleted...',
            result: result
        })
    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `somthing going wrong , please check...`
        })
    })
}
