const eventModel = require("../Model/event");
const eventVideoModel = require("../Model/eventVideos");
const participantsModel = require("../Model/participants");
const reactionStatusModel = require("../Model/reactionStatus");
const ratingModule = require("../Model/rating");
const followersModel = require("../Model/followers")
const moment = require("moment")
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
  const eventStatus = req.body.eventStatus;
  const eventPayload = new eventModel({
    userId: userId,
    title: title,
    description: description,
    inviteTo: inviteTo,
    award: award,
    startDate: startDate,
    endDate: endDate,
    entryFee: entryFee,
    eventStatus: eventStatus
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
    eventModel.findByIdAndUpdate(eventId, {
      $push: {
        participants: {
          participantId: userId,
          videoPostStaus: false
        }
      }
    }).then(participants => {
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
  const tags = req.body.tags;
  const EventVideoPayload = new eventVideoModel({
    eventId: eventId,
    title: title,
    description: description,
    link: link,
    videoType: videoType,
    videoSource: videoSource,
    userId: userId,
    videoStatus: videoStatus,
    thumbnail: thumbnail,
    duration: duration,
    avgRating: avgRating,
    ratingUserCount: ratingUserCount,
    tags:tags
  })
  // ****** Checking the participant Status ***** // 
  participantsModel.find({ userId: userId }).then(result => {
    if (result.length > 0) {
      eventVideoModel.find({ userId: userId, eventId: eventId }).then(result0 => {
        if (result0.length > 0) {
          res.status(200).json({
            statusCode: 200,
            message: `Sorry you can't post more than one video..`,
          })
        } else {
          EventVideoPayload.save().then(async result1 => {
            const updateStatus = await eventModel.findOneAndUpdate({ _id: eventId, participants: { $elemMatch: { participantId: userId } } },
              { $set: { "participants.$.videoPostStaus": true } })
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
        }

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

//*************Event Video rating ************ */
exports.MarkEventVideoRating = async (req, res, next) => {
  const userId = req.body.userId;
  const videoId = req.body.videoId;
  const rating = req.body.rating;
  const avgRating = req.body.avgRating;
  const ratingUserCount = req.body.ratingUserCount;
  const ratingPayload = new ratingModule({
    userId: userId,
    videoId: videoId,
    rating: rating,
    ratingStatus: true,
  })
  ratingModule.find({ userId: userId, videoId: videoId }).then(result => {
    if (result.length > 0) {
      const calRating = (((parseFloat(avgRating) * ratingUserCount)) + (parseFloat(rating) - parseFloat(result[0].rating))) / (ratingUserCount)
      ratingModule.findOneAndUpdate({ userId: userId, videoId: videoId }, { rating: rating }).then(result1 => {
        eventVideoModel.findByIdAndUpdate(videoId, { avgRating: calRating, ratingUserCount: ratingUserCount }, { new: true })
          .then(result2 => {
            res.status(200).json({
              statusCode: 200,
              message: `Your rating is saved successfully`,
              result: result2
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
        const calRating = ((parseFloat(avgRating) * ratingUserCount) + parseFloat(rating)) / (ratingUserCount + 1)
        eventVideoModel.findByIdAndUpdate(videoId, { avgRating: calRating, ratingUserCount: ratingUserCount + 1 }, { new: true })
          .then(result1 => {
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

    }

  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `somthing going wrong please check and err_message is ${err}`
    })

  })
}
// *********All event Video list************
exports.GetEventVideoList = async (req, res, next) => {
  const eventId = req.body.eventId;
  eventVideoModel.find({ eventId: eventId }).sort({ avgRating: -1 })
    .then(result => {
      res.status(200).json({
        statusCode: 200,
        message: `Event Video List Fetch Successsfully`,
        result: result
      })
    })
    .catch(err => {
      res.status(401).json({
        statusCode: 401,
        message: `something going wrong please check and error is ${err}`
      })
    })
}

//************* Get  draft and post  Event List *********** */

exports.GetPostAndDraftEvent = async (req, res, next) => {
  const userId = req.body.userId;
  const eventStatus = req.body.eventStatus;
  eventModel.find({ userId: userId, eventStatus: eventStatus }).sort({ _id: -1 }).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: `Event List`,
      result: result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `somthing going wrong please check again and err is ${err}`
    })
  })
}

// *************Posting draft event *********

exports.PostDraftEvent = async (req, res, next) => {
  const eventId = req.body.eventId;
  const eventStatus = req.body.eventStatus;
  eventModel.findByIdAndUpdate(eventId, { eventStatus: eventStatus }).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: `Your Draft event is posted successfully..`,
      result: result
    })
  }).catch(err => {
    res.status(401).json({
      message: `something going wrong please check again and err is ${err}`
    })
  })
}

//**************user Reaction on video ********** */
exports.EventVideoReaction = async (req, res, next) => {
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
        eventVideoModel.find({ _id: videoId, reaction: { $elemMatch: { NAME: NAME, CODE: CODE } } }).then(result1 => {
          if (result1.length > 0) {
            eventVideoModel.findOneAndUpdate({ _id: videoId, reaction: { $elemMatch: { NAME: NAME, CODE: CODE } } },
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
            eventVideoModel.findByIdAndUpdate(videoId, {
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
        eventVideoModel.findOneAndUpdate({ _id: videoId, reaction: { $elemMatch: { NAME: result0[0].name, CODE: result0[0].code } } },
          { $inc: { "reaction.$.COUNT": -1 } }, { new: true })
          .then(result2 => {
            // checking reaction is available or not ***** 
            eventVideoModel.find({ _id: videoId, reaction: { $elemMatch: { NAME: NAME, CODE: CODE } } }).then(result3 => {
              if (result3.length > 0) {
                eventVideoModel.findOneAndUpdate({ _id: videoId, reaction: { $elemMatch: { NAME: NAME, CODE: CODE } } },
                  { $inc: { "reaction.$.COUNT": 1 } }, { new: true }).then(result4 => {
                    res.status(200).json({
                      statusCode: 200,
                      message: `you have reacted on a video`,
                      result: result4
                    })
                  }).catch(err => {
                    res.status(401).json({
                      statusCode: 401,
                      message: `something going wrong please check and error is ${err}`
                    })
                  })
              } else {
                eventVideoModel.findByIdAndUpdate(videoId, {
                  $push: {
                    reaction: {
                      NAME: NAME,
                      CODE: CODE,
                      COUNT: 1,
                      EMOOJI: EMOOJI
                    }
                  }
                }, { new: true }).then(result5 => {
                  res.status(200).json({
                    statusCode: 200,
                    message: `you have reacted on a video`,
                    result: result5
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
            // *******end here******

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

// *************** ALL Event List ************* 
exports.GetEventList = async (req, res, next) => {
  const Today_Date = moment().format();
  eventModel.find({ endDate: { $gte: Today_Date }, eventStatus: true })
    .populate("userId", `-password -otpVerification -deviceId`)
    .populate("participants.participantId", `-password -otpVerification -deviceId`)
    .then(result => {
      res.status(200).json({
        statusCode: 200,
        message: `Event details list`,
        result: result
      })
    }).catch(err => {
      res.status(401).json({
        statusCode: 401,
        message: `something going wrong please check and error is ${err}`
      })
    })
 
}

//***********Replace Event video by participants******** */
exports.ReplaceEventVideo = async (req, res, next) => {
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
  const avgRating = "0.00";
  const ratingUserCount = 0;
  const tags = req.body.tags;
  const payload = {
    eventId: eventId,
    title: title,
    description: description,
    link: link,
    videoType: videoType,
    videoSource: videoSource,
    userId: userId,
    videoStatus: videoStatus,
    thumbnail: thumbnail,
    duration: duration,
    avgRating: avgRating,
    ratingUserCount: ratingUserCount,
    tags:tags
  }
  eventVideoModel.findOneAndUpdate({ userId: userId, eventId: eventId }, payload).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: `event vidoe is updated`,
      result: result
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `something wrong please check again and err is ${err}`
    })
  })
}
