import { query } from "express";
import specialtyService from "../services/specialtyService";

let createNewSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.createNewSpecialty(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res
      .status(200)
      .json({ errorCode: -1, errorMessage: "error from sever", e });
  }
};

let getAllSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.getAllSpecialty();
    return res.status(200).json(data);
  } catch (e) {
    return res
      .status(200)
      .json({ errorCode: -1, errorMessage: "error from sever", e });
  }
};

let getDetailSpecialtyById = async (req, res) => {
  try {
    let data = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
    return res.status(200).json(data);
  } catch (e) {
    return res
      .status(200)
      .json({ errorCode: -1, errorMessage: "error from sever", e });
  }
};

module.exports = {
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
};
