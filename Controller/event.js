const eventModel = require("../Model/event");
const eventVideoModel = require("../Model/eventVideos");
const participantsModel = require("../Model/participants")
//************** create new Event******** */
exports.CreateEvent = async (req, res, next) => {
    const userId = req.body.userId;
    const title = req.body.title;
    const description = req.body.description;
    const inviteTo = req.body.inviteTo;
    const award = req.body.award;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const entryFee = req.body.entryFee;
    const eventPayload = new eventModel({
        userId: userId,
        title: title,
        description: description,
        inviteTo: inviteTo,
        award: award,
        startDate: startDate,
        endDate: endDate,
        entryFee: entryFee
    })
    eventPayload.save().then(result => {
        res.status(200).json({
            statusCode: 200,
            message: `Event is created successfully ...`,
            result: result
        })

    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `something going wrong please check and err msg is ${err}`
        })
    })

}

//********** Fetch All Event list ********* */
exports.GetEventList = async (req, res, next) => {
    eventModel.find().then(result => {
        res.status(200).json({
            statusCode: 200,
            message: `All event List Fetch SuccessFully..`,
            result: result
        })
    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `something going wrong please check and err msg is ${err}`
        })
    })
}

//****** Fetch Event Details by eventId ********/

exports.GetEventById = async (req, res, next) => {
    const _id = req.body._id
    eventModel.findById(_id).then(result => {
        res.status(200).json({
            statusCode: 200,
            message: `Event details  Fetch SuccessFully..`,
            result: result
        })
    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `something going wrong please check and err msg is ${err}`
        })
    })
}

//************ Join Event ********* */

exports.JoinEvent = async (req, res, next) => {
    const eventId = req.body.eventId;
    const userId = req.body.userId;
    const paymentStatus = req.body.paymentStatus;
    const transId = req.body.transId;
    participantsPayLoad = new participantsModel({
        eventId: eventId,
        userId: userId,
        paymentStatus: paymentStatus,
        transId: transId
    })
    participantsPayLoad.save().then(result => {
        res.status(200).json({
            statusCode: 200,
            message: `you have joined event SuccessFully..`,
            result: result
        })
    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `something going wrong please check and err msg is ${err}`
        })
    })
}

//**************** Posting Event Video********/
exports.PostEventVideos = async (req, res, next) => {
    const eventId = req.body.eventId;
    const title = req.body.title;
    const description = req.body.description;
    const link = req.body.link;
    const videoType = req.body.videoType;
    const videoSource = req.body.videoSource;
    const userId = req.body.userId;
    const videoStatus = req.body.videoStatus;
    const thumbnail = req.body.thumbnail;
    const duration = req.body.duration;
    const avgRating = req.body.avgRating;
    const ratingUserCount = req.body.ratingUserCount;
    const EventVideoPayload = new eventVideoModel({
        eventId: eventId,
        title: title,
        description: description,
        link: link,
        videoType: videoType,
        videoSource: videoSource,
        userIdL: userId,
        videoStatus: videoStatus,
        thumbnail: thumbnail,
        duration: duration,
        avgRating: avgRating,
        ratingUserCount: ratingUserCount
    })
    // ****** Checking the participant Status ***** // 
    participantsModel.find({ userId: userId }).then(result => {
        if (result.length > 0) {
            EventVideoPayload.save().then(result1 => {
                res.status(200).json({
                    statusCode: 200,
                    message: `Your video is postd Successfully..`,
                    result: result1
                })
            }).catch(err => {
                res.status(401).json({
                    statusCode: 401,
                    message: `Something going wrong please check again and err msg is ${err}`
                })
            })
        } else {
            res.status(200).json({
                statusCode: 200,
                message: `please join the event first...`
            })
        }
    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `Something going wrong please check again and err msg is ${err}`
        })
    })
}