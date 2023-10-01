const userModel = require("../Model/user");
const common = require("../Utilities/common")
// *********** Register new User  *********
exports.userSignUp = async(req, res, next) => {
  const Regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
  const Email_Phone = req.body.Email_Phone;
  userModel.find({ $or: [{ Email: Email_Phone }, { phone: Email_Phone }] }).then(result => {
    if (result != undefined && result.length === 0) {
      if (Email_Phone.match(Regex)) {
        common.SendOtpToEmail(Email_Phone).then(result => {
          const userModelData = new userModel({
            Username: result.User_Name,
            Email: Email_Phone,
            password: result.encrypt_pass,
          });
          userModelData.save().then(results => {
            res.status(200).json({
              statusCode: 200,
              message: `OTP has heen sent to your Email address ${Email_Phone}`,
              result: results
            })
          }).catch(err => {
            res.status(401).json({
              statusCode: 401,
              message: "somthing going wrong, please check Email address..",
              err: err
            })
          })
        }).catch(err => {
          res.status(401).json({
            statusCode: 401,
            message: "somthing going wrong, please check Email address..",
            err: err
          })
        })
      } else {
        common.SendOtpToMobile(Email_Phone).then(result => {
          if (result.response === true) {
            const userModelData = new userModel({
              phone: Email_Phone,
              password: result.encrypt_pass,
            });
            userModelData.save().then(result => {
              res.status(200).json({
                statusCode: 200,
                message: `OTP has been sent to your mobile no ${Email_Phone}`,
                result: result
              })
            }).catch(err => {
              res.status(401).json({
                statusCode: 401,
                message: `somthing going wrong , please check mobile no again`,
                err: err
              })
            })
          } else {
            res.status(401).json({
              statusCode: 401,
              message: `somthing going wrong , please check mobile no again`,
            })
          }
        }).catch(err => {
          res.status(401).json({
            statusCode: 401,
            message: `somthing going wrong , please check mobile no again`,
            err: err
          })
        })
      }
    } else {
      res.status(401).json({
        statusCode: 401,
        message: "user already exist ...."
      })
    }
  }).catch(err => {
      res.status(401).json({
      statusCode: 401,
      message: err
    })
  })
};
// *********Login User*********
exports.LoginUser = async (req, res, next) => {
  const Username = req.body.Username;
  const Email = req.body.Email;
  userModel
    .find({ Username: Username, Email: Email })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          statusCode: 200,
          message: "user login successful",
          user: result,
        });
      } else {
        res.status(200).json({
          statusCode: 401,
          message: "user doesn't exist ",
        });
      }
    })
    .catch((err) => {
      res.status(401).json({
        message: err,
        statusCode: 401,
      });
    });
};

// *********** Fetch All User List ************
exports.GetAllUserList = async (req, res, next) => {
  userModel
    .find()
    .select("-password")
    .then((result) => {
      res.status(200).json({
        statusCode: 200,
        message: "Registered userList",
        userList: result,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
};

// ********** Get UserDetails By userId**************
exports.GetUserDetailsById = async (req, res, next) => {
  const userId = req.body._id;
  userModel
    .findById({ _id: userId })
    .then((result) => {
      res.status(200).json({
        statusCode: 200,
        message: "user detail",
        userdetail: result,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
};

// *********edit user detail *******************
exports.FindByIdAndUpdate = async (req, res, next) => {
  const id = req.body._id;
  const Username = req.body.Username;
  const Email = req.body.Email;
  const Avatar = req.body.Avatar;
  const About = req.body.About;
  const DOB = req.body.DOB;
  const password = req.body.password;
  const userPayload = {
    Username: Username,
    Email: Email,
    Avatar: Avatar,
    About: About,
    DOB: DOB,
    password: password,
  };
  userModel
    .findByIdAndUpdate(id, userPayload, { new: true })
    .then((result) => {
      res.status(200).json({
        statusCode: 200,
        message: "user Detail is updated  successfully",
        userdetail: result,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
};

// ************* OTP verification ****************
exports.OTPVerification = async(req, res, next) => {
  const OTP = req.body.otp;
  common.EncryptPassword(OTP).then(result => {
   userModel.find({ password: result }).then(result1 => {
      if(result1 !=undefined && result1.length>0){
        res.status(200).json({
          statusCode: 200,
          message: `OTP verification is successfull`,
          result: result1
        })
      }else{
        res.status(401).json({
          statusCode: 401,
          message: `OTP is Invalid`,
        })
      }
    }).catch(err => {
      res.status(401).json({
        statusCode: 401,
        message: `OTP is Invalid`,
        err: err
      })
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `OTP is Invalid`,
      err: err
    })
  })
}

// **************** Sign_Up with Social Media**********
exports.SignUpWithSocialMedia = async (req, res, next) => {
  const Username = req.body.Username;
  const Email = req.body.Email;
  const Avatar = req.body.Avatar;
  const About = req.body.About;
  const DOB = req.body.DOB;
  const phone = req.body.phone;
  common.EncryptPassword(ALShare).then(result => {
    const userPayload = new userModel({
      Username: Username,
      Email: Email,
      Avatar: Avatar,
      About: About,
      DOB: DOB,
      phone: phone,
      password: result,
    })
    userPayload.save().select("-password").then(result => {
      res.status(200).json({
        statusCode: 200,
        message: "user registered successfully",
        result: result
      })
    }).catch(err => {
      res.status(401).json({
        statusCode: 401,
        message: err,
      })
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: err,
    })
  })
}

