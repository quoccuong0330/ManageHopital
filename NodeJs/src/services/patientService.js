import db from "../models/index";
import { sendEmailToPatient } from "./emailService";
import { v4 as uuidv4 } from "uuid";
import { reject } from "lodash";
require("dotenv").config();

let buildUrlEmail = (doctorId, token) => {
  let url = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return url;
};

let postBookingAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName
      ) {
        resolve({
          errCode: 1,
          errMessage: "missing params",
        });
      } else {
        let token = uuidv4();
        await sendEmailToPatient({
          receiverEmail: data.email,
          fullName: data.fullName,
          time: data.timeString,
          nameDoctor: data.nameDoctor,
          redirectLink: buildUrlEmail(data.doctorId, token),
          language: data.language,
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timeType,
              token: token,
              patientId: user[0].id,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postVerifyBookingAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "missing params verify",
          data,
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        console.log(appointment, data);

        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update status success",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exits",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { postBookingAppointment, postVerifyBookingAppointment };
