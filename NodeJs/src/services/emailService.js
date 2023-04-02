const nodemailer = require("nodemailer");
require("dotenv").config();

let sendEmailToPatient = async (data) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  // send mail with defined transport object
  await transporter.sendMail({
    from: `Booking care service`, // sender address
    to: data.receiverEmail, // list of receivers
    subject: getSubjectLanguage(data), // Subject line
    html: getHTMLLanguage(data), // html body
  });
};

let getSubjectLanguage = (data) => {
  let result = "";
  if (data.language === "vi") {
    result = "Đặt lịch khám bệnh ở Booking Care";
  } else if (data.language === "en") {
    result = "Book an appointment at Booking Care";
  }
  return result;
};

let getHTMLLanguage = (data) => {
  let result = "";
  if (data.language === "vi") {
    result = `<h3>Xin chào ${data.fullName},</h3>
      <p>Bạn nhận được mail này vì đã đặt lịch khám bệnh online tại Booking Care</p>
      <p>Thông tin đặt lịch khám bệnh:</p>
      <div><b>Thời gian: ${data.time} </b></div>
      <div><b>Tên bác sĩ: ${data.nameDoctor} </b></div>
      <p>Nếu các thông tin dưới đây chính xác, bạn vui lòng bấm vào link bên dưới để xác nhận: </p>
      <div> <a href=${data.redirectLink} target="_blank">Click here</a></div>
      <div>Chân thành cảm ơn</div>
      `;
  } else if (data.language === "en") {
    result = `<h3>Hello ${data.fullName},</h3>
      <p>You received this message because you booked an online medical appointment at Booking Care</p>
      <p>Information to book an appointment:</p>
      <div><b>Time: ${data.time} </b></div>
      <div><b>Doctor Name: ${data.nameDoctor} </b></div>
      <p>If the information below is correct, please click the link below to confirm: </p>
      <div> <a href=${data.redirectLink} target="_blank">Click here</a></div>
      <div>Thank you very much</div>
      `;
  }
  return result;
};

module.exports = {
  sendEmailToPatient,
};
