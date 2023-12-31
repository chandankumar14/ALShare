const userModel = require("../Model/user");
const common = require("../Utilities/common")
// *********** Register new User  *********
exports.userSign_up = async (req, res, next) => {
  const Email_Phone = req.body.Email_Phone;
  const deviceId = req.body.deviceId
  const Regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
  const userCheck = await userModel.find({ $or: [{ Email: Email_Phone }, { phone: Email_Phone }] });
  if (userCheck && userCheck.length === 0) {
    if (Email_Phone.match(Regex)) {
      // ****** Send OTP to Email Address**********
      const result = await common.SendOtpToEmail(Email_Phone)
      const userModelData = new userModel({
        Username: result.User_Name,
        Email: Email_Phone,
        password: result.encrypt_pass,
      });
      userModelData.save().then(response => {
        res.status(200).json({
          statusCode: 200,
          message: `OTP has been sent to your Email ${Email_Phone}`,
          result: [response]
        })
      }).catch(err => {
        res.status(401).json({
          statusCode: 401,
          message: `please check email address.. ${err}`
        })
      })

    } else {
      // ******** Send OTP to mobile number*********
      const userName =  common.generateUsername();
      const result = await common.SendOtpToMobile(Email_Phone)
      const userModelData = new userModel({
        Username:userName,
        phone: Email_Phone,
        password: result.encrypt_pass,
      });
      userModelData.save().then(response => {
        res.status(200).json({
          statusCode: 200,
          message: `OTP has been sent to your phone number ${Email_Phone}`,
          result: [response]
        })
      }).catch(err => {
        res.status(401).json({
          statusCode: 401,
          message: `please check .. ${err}`
        })
      })
    }

  }
  else if (userCheck[0].otpVerification === false) {
    const _id = userCheck[0]._id
    if (Email_Phone.match(Regex)) {
      const result = await common.SendOtpToEmail(Email_Phone)
      const updatepass = await userModel.findByIdAndUpdate(_id, { password: result.encrypt_pass })
      if (updatepass) {
        res.status(200).json({
          statusCode: 200,
          message: `OTP has been sent to your Email ${Email_Phone}`,
          result:[updatepass]
        })
      }
    }
    else {
      const result = await common.SendOtpToMobile(Email_Phone)
      const updatepass = await userModel.findByIdAndUpdate(_id, { password: result.encrypt_pass },{new:true})
      if (updatepass) {
        res.status(200).json({
          statusCode: 200,
          message: `OTP has been sent to your phone number ${Email_Phone}`,
          result:[updatepass]
        })
      }
    }
  } else if (userCheck.length > 0 && userCheck[0].otpVerification === true && userCheck[0].deviceId != deviceId) {
    const _id = userCheck[0]._id
    if (Email_Phone.match(Regex)) {
      const result = await common.SendOtpToEmail(Email_Phone)
      const updatepass = await userModel.findByIdAndUpdate(_id, { password: result.encrypt_pass,otpVerification:false })
      if (updatepass) {
        res.status(200).json({
          statusCode: 200,
          message: `OTP has been sent to your Email ${Email_Phone}`,
          result: [updatepass]
        })
      }
    }
    else {
      const result = await common.SendOtpToMobile(Email_Phone)
      const updatepass = await userModel.findByIdAndUpdate(_id, { password: result.encrypt_pass,otpVerification:false }, { new: true })
      if (updatepass) {
        res.status(200).json({
          statusCode: 200,
          message: `OTP has been sent to your phone number ${Email_Phone}`,
          result: [updatepass]
        })
      }
    }
  }
  else if (userCheck.length > 0 && userCheck[0].otpVerification === true && userCheck[0].deviceId===deviceId) {
    res.status(401).json({
      statusCode: 200,
      message: `you are logedIn successfully...`,
      result: userCheck
    })
  }
  else {
    res.status(401).json({
      statusCode: 401,
      message: `somthing going wrong please check again...`,

    })
  }
}

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
  const Avatar = req?.file?.filename ? req.file.filename : req.body.Avatar;
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
        message: "User Detail is updated  successfully",
        userdetail: result,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
};

// ************* OTP verification ****************
exports.OTPVerification = async (req, res, next) => {
  const OTP = req.body.otp;
  const deviceId = req.body.deviceId;
  common.EncryptPassword(OTP).then(result => {
    userModel.find({ password: result }).then(async result1 => {
      if (result1 != undefined && result1.length > 0) {
        const verification = await userModel.findOneAndUpdate({ password: result }, { otpVerification: true, deviceId: deviceId }, { new: true })
        if (verification) {
          res.status(200).json({
            statusCode: 200,
            message: `OTP verified`,
            result: [verification]
          })
        }
      } else {
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

//*************Log_out user */

exports.LogoutUser = async (req, res, next) => {
  const userId = req.body._id;
  userModel.findByIdAndUpdate(userId, { deviceId: "ALShare" }).then(result => {
    res.status(200).json({
      statusCode: 200,
      message: `user logout successfully`
    })
  }).catch(err => {
    res.status(401).json({
      statusCode: 401,
      message: `somting going wrong ${err}`
    })
  })
}
