import db from "../models/index";
require("dotenv").config();
import _, { indexOf, reject } from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveInfoDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.doctorId ||
        !data.contentHTML ||
        !data.contentMarkdown ||
        !data.action ||
        !data.nameClinic ||
        !data.addressClinic ||
        !data.selectedPayment ||
        !data.selectedProvince ||
        !data.selectedPrice
      ) {
        resolve({
          errorCode: 1,
          errorMessage: "Missing params",
        });
      } else {
        if (data.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: data.contentHTML,
            contentMarkdown: data.contentMarkdown,
            description: data.description,
            doctorId: data.doctorId,
          });
        } else if (data.action === "EDIT") {
          let doctorEdit = await db.Markdown.findOne({
            where: { doctorId: data.doctorId },
            raw: false,
          });
          if (doctorEdit) {
            doctorEdit.contentHTML = data.contentHTML;
            doctorEdit.contentMarkdown = data.contentMarkdown;
            doctorEdit.description = data.description;
            await doctorEdit.save();
          }
        }
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: data.doctorId },
          raw: false,
        });
        if (doctorInfo) {
          doctorInfo.paymentId = data.selectedPayment;
          doctorInfo.provinceId = data.selectedProvince;
          doctorInfo.priceId = data.selectedPrice;
          doctorInfo.addressClinic = data.addressClinic;
          doctorInfo.nameClinic = data.nameClinic;
          doctorInfo.note = data.note;
          doctorInfo.specialtyId = data.selectedSpecialty;
          await doctorInfo.save();
        } else {
          await db.Doctor_Info.create({
            id: data.doctorId,
            doctorId: data.doctorId,
            paymentId: data.selectedPayment,
            provinceId: data.selectedProvince,
            priceId: data.selectedPrice,
            addressClinic: data.addressClinic,
            specialtyId: data.selectedSpecialty,
            nameClinic: data.nameClinic,
            note: data.note,
          });
        }
      }

      resolve({
        errorCode: 0,
        errorMessage: "Successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: -1,
          errorMessage: "Missing parameter",
        });
      } else {
        let doctor = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Specialty,
                  as: "specialtyTypeData",
                  attributes: ["contentHTML", "contentMarkdown", "name", "id"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (doctor && doctor.image) {
          doctor.image = new Buffer(doctor.image, "base64").toString("binary");
        }
        if (!doctor) doctor = {};
        resolve({
          errCode: 0,
          data: doctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleBulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errorMessage: "Missing require params",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        if (toCreate && toCreate.length === 0) {
          resolve({
            errCode: -1,
            errorMessage: "Da co lich dat kham",
          });
        }

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          errorMessage: "Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getScheduleDoctorByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: -1,
          errorMessage: "Missing parameter",
        });
      } else {
        let doctorSchedule = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!doctorSchedule) {
          doctorSchedule = [];
        }

        resolve({
          errCode: 0,
          data: doctorSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getExtraInfoDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject(e);
      } else {
        let data = await db.Doctor_Info.findOne({
          where: { doctorId: id },
          exclude: ["id", "doctorId"],
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: -1,
          errorMessage: "Missing parameter",
        });
      } else {
        let doctor = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (doctor && doctor.image) {
          doctor.image = new Buffer(doctor.image, "base64").toString("binary");
        }
        if (!doctor) doctor = {};
        resolve({
          errCode: 0,
          data: doctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorHome,
  getAllDoctor,
  saveInfoDoctor,
  getDetailDoctorById,
  handleBulkCreateSchedule,
  getScheduleDoctorByDate,
  getExtraInfoDoctorById,
  getProfileDoctorById,
};
