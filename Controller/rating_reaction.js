const ratingModule = require("../Model/rating_reaction");
const videoModule = require("../Model/video");

exports.MarkVideoRating = async (req, res, next) => {
    const userId = req.body.userId;
    const videoId = req.body.videoId;
    const rating = req.body.rating;
    const ratingStatus = req.body.ratingStatus;
    const reactionType = req.body.reactionType;
    const avgRating = req.body.avgRating;
    const ratingUserCount = req.body.ratingUserCount;
    const ratingPayload = new ratingModule({
        userId: userId,
        videoId: videoId,
        rating: rating,
        ratingStatus: ratingStatus,
        reactionType: reactionType,
    })

    ratingModule.find({ userId: userId, videoId: videoId }).then(result => {
        if (result.length > 0) {
            ratingModule.findOneAndUpdate({ userId: userId, videoId: videoId }, { rating: rating }).then(result1 => {
                videoModule.findByIdAndUpdate(videoId, { avgRating: avgRating, ratingUserCount: ratingUserCount })
                    .then(result2 => {
                        res.status(200).json({
                            statusCode: 200,
                            message: `Your rating is saved successfully`,
                            result: result1
                        })
                    }).catch(err => {
                        res.status(401).json({
                            statusCode: 401,
                            message: `somthing going wrong please check and err_message is ${err}`
                        })
                    })
            }).catch(err => {
                res.status(401).json({
                    statusCode: 401,
                    message: `somthing going wrong please check and err_message is ${err}`
                })
            })

        } else {
            ratingPayload.save().then(result3 => {
                videoModule.findByIdAndUpdate(videoId, { avgRating: avgRating, ratingUserCount: ratingUserCount })
                    .then(result1 => {
                        res.status(200).json({
                            statusCode: 200,
                            message: `Your rating is saved successfully`,
                            result: result3
                        })
                    }).catch(err => {
                        res.status(401).json({
                            statusCode: 401,
                            message: `somthing going wrong please check and err_message is ${err}`
                        })
                    })
            }).catch(err => {
                res.status(401).json({
                    statusCode: 401,
                    message: `somthing going wrong please check and err_message is ${err}`
                })
            })

        }

    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `somthing going wrong please check and err_message is ${err}`
        })

    })


}


exports.GetRatedvideo = async (req, res, next) => {
    const userId = req.body.userId;
    const videoId = req.body.videoId;
    ratingModule.find({ userId: userId, videoId: videoId })
        .populate("userId", `_id Username Email createdAt updatedAt`)
        .populate("videoId", `-__v`)
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    statusCode: 200,
                    message: 'video details is fetch successfully.',
                    result: result
                })
            } else {
                videoModule.findById(videoId).then(result1 => {
                    res.status(200).json({
                        statusCode: 200,
                        message: 'video details is fetch successfully.',
                        result: [result1]
                    })
                }).catch(err => {
                    res.status(401).json({
                        statusCode: 401,
                        message: `something going wrong please check and err_message is ${err}`
                    })
                })
            }
        }).catch(err => {
            res.status(401).json({
                statusCode: 401,
                message: `something going wrong please check and err_message is ${err}`
            })
        })
}