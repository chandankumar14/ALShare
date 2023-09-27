const userModel = require("../Model/user");
// *********** Register new User  *********
exports.userSignUp = async (req, res, next) => {
  const Username = req.body.Username;
  const Email = req.body.Email;
  const Avatar = req.body.Avatar;
  const About = req.body.About;
  const password = req.body.password;
  const DOB = req.body.DOB;
  const userModelData = new userModel({
    Username: Username,
    Email: Email,
    Avatar: Avatar,
    About: About,
    DOB: DOB,
    password: password,
  });

userModel.find({Email:Email}).then(result=>{
  if(result!=undefined && result.length===0){
    userModelData
    .save()
    .then((result) => {
      res.status(200).json({
        statusCode: 200,
        message: "user registered successfull",
        user: result,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err, statusCode: 401 });
    });
  }else{
    res.status(401).json({
      statusCode:401,
      message:"user already exist ...."
    })
  }
}).catch(err=>{
  res.status(401).json({
    statusCode:401,
    message:err
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
