const axios = require("axios")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// *********Generate 4 digit random number **********
function generateOTP() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// ************** Generate username **********
function generateUsername() {
  var digits = '0123456789';
  let TwoDigit = '';
  for (let i = 0; i < 3; i++) {
    TwoDigit += digits[Math.floor(Math.random() * 10)];
  }
  const User_Name  = "user".concat(TwoDigit)
  return User_Name;
}
// ************ password Encryption using node crypto module*********** 
async function EncryptPassword(pass) {
  const secret_vector = process.env.SECRET_VECTOR;
  const secret_vector_init_key = process.env.SECRET_VECTOR_INIT_KEY;
  const secret_init_key = process.env.SECRET_INIT_KEY;
  const secret_key = process.env.SECRET_KEY;
  const algorithm = process.env.ALGORITHM;
  const initVector = crypto.createHmac("sha256", secret_vector).update(secret_vector_init_key).digest("base64url").substring(0, 16);
  const Securitykey = crypto.createHmac("sha256", secret_key).update(secret_init_key).digest("base64url").substring(0, 32);;
  const password = pass;
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  const EncryptedData = Buffer.from(cipher.update(password, "utf8", "hex") + cipher.final("hex")).toString("base64");
  return EncryptedData
}

// *************** Password Decryption using node crypto module************
 async function DecryptPassowrd(encrypt_pass) {
  const secret_vector = process.env.SECRET_VECTOR;
  const secret_vector_init_key = process.env.SECRET_VECTOR_INIT_KEY;
  const secret_init_key = process.env.SECRET_INIT_KEY;
  const secret_key = process.env.SECRET_KEY;
  const algorithm = process.env.ALGORITHM;
  const initVector = crypto.createHmac("sha256", secret_vector).update(secret_vector_init_key).digest("base64url").substring(0, 16);
  const Securitykey = crypto.createHmac("sha256", secret_key).update(secret_init_key).digest("base64url").substring(0, 32);;
  const encrypted_password = encrypt_pass
  const buff = Buffer.from(encrypted_password, "base64");
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  const Decrypt = decipher.update(buff.toString("utf8"), "hex", "utf8") + decipher.final("utf8");
  return Decrypt
}
// *********** Send OTP to Mobile Number *********** 
async function SendOtpToMobile(phone_number) {
  const route = process.env.ROUTE
  const variables_values = generateOTP()
  const encrypt_pass = await EncryptPassword(variables_values)
  const numbers = phone_number
  const flash = "0"
  const fast2sms_base_url = process.env.FAST_2_SMS_URL
  const authorization = process.env.AUTHORIZATION_KEY
  const Url = `${fast2sms_base_url}?authorization=${authorization}&route=${route}&variables_values=${variables_values}&flash=${flash}&numbers=${numbers}`
  const response = await axios.get(Url)
  if (response && response != undefined && encrypt_pass && encrypt_pass != undefined) {
    return {
      response: response.data.return,
      encrypt_pass: encrypt_pass
    }
  }
}
// ********** send OTP to email Address ******* 
async function SendOtpToEmail(Email) {
  const OTP = generateOTP()
  const Email_Address = Email;
  const encrypt_pass  = await EncryptPassword(OTP) 
  const User_Name = Email_Address.split("@")[0]
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE_NAME,
    auth: {
      user: process.env.EMAIL_USER_NAME,
      pass: process.env.EMAIL_USER_PASS
    }
  });
  const mailOptions = {
    from: 'chandan.kumar@acelucid.com',
    to: Email,
    subject: 'ALShare OTP Verification',
    html: `<div style="font-family:emoji; font-size=20px; min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">ALShare</a>
            </div>
            <p style="font-size:1.1em">Hi, ${User_Name}</p>
            <p style="font-family:emoji;font-size=25px;">Thank you for choosing ALShare. please use the following OTP to complete your sign up procedures.</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
            <p style="font-size:16px;font-family:emoji">Regards,<br />ALShare</p>
            <hr style="border:none;border-top:1px solid #eee" />
            </div>
            </div>`
  };
  const Result = await transporter.sendMail(mailOptions)
  if (Result && Result != undefined  && encrypt_pass && encrypt_pass!=undefined) {
    return {
      encrypt_pass:encrypt_pass,
      User_Name: User_Name
    }
  }
}

module.exports = {
  EncryptPassword,
  DecryptPassowrd,
  SendOtpToMobile,
  SendOtpToEmail,
  generateUsername
}