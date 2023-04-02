import db from "../models/index";

require("dotenv").config();

let createNewSpecialty = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.contentMarkdown ||
        !data.contentHTML ||
        !data.name ||
        !data.imgBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing params",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          contentMarkdown: data.contentMarkdown,
          contentHTML: data.contentHTML,
          image: data.imgBase64,
        });

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

let getAllSpecialty = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "success",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailSpecialtyById = async (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing params",
        });
      } else {
        let data = {};
        if (location === "ALL") {
          data = await db.Specialty.findOne({
            where: { id: id },
            attributes: ["contentMarkdown", "contentHTML"],
          });
          data.arrDoctorId = await db.Doctor_Info.findAll({
            where: { specialtyId: id },
            attributes: ["doctorId", "provinceId"],
          });
          resolve({
            errCode: 0,
            errMessage: "Success",
            data,
          });
        } else {
          data = await db.Specialty.findOne({
            where: { id: id },
            attributes: ["contentMarkdown", "contentHTML"],
          });
          data.arrDoctorId = await db.Doctor_Info.findAll({
            where: { specialtyId: id, provinceId: location },
            attributes: ["doctorId", "provinceId"],
          });
          resolve({
            errCode: 0,
            errMessage: "Success",
            data,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
};
