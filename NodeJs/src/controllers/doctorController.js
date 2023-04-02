import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;

  if (!limit) limit = 10;
  try {
    let doctor = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(doctor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from sever",
    });
  }
};

let getAllDoctor = async (req, res) => {
  try {
    let doctor = await doctorService.getAllDoctor();
    return res.status(200).json(doctor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from sever",
    });
  }
};

let saveInfoDoctor = async (req, res) => {
  let message = await doctorService.saveInfoDoctor(req.body);
  return res.status(200).json(message);
};

let getDetailDoctorById = async (req, res) => {
  try {
    let doctor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(doctor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "error from sever",
    });
  }
};

let handleBulkCreateSchedule = async (req, res) => {
  let message = await doctorService.handleBulkCreateSchedule(req.body);
  console.log(message);
  return res.status(200).json(message);
};

let getScheduleDoctorByDate = async (req, res) => {
  let info = await doctorService.getScheduleDoctorByDate(
    req.query.doctorId,
    req.query.date
  );

  return res.status(200).json(info);
};

let getExtraInfoDoctorById = async (req, res) => {
  let message = await doctorService.getExtraInfoDoctorById(req.query.doctorId);

  return res.status(200).json(message);
};

let getProfileDoctorById = async(req,res)=> {
  let message = await doctorService.getProfileDoctorById(req.query.doctorId);

  return res.status(200).json(message);
}

module.exports = {
  getTopDoctorHome,
  getAllDoctor,
  saveInfoDoctor,
  getDetailDoctorById,
  handleBulkCreateSchedule,
  getScheduleDoctorByDate,
  getExtraInfoDoctorById,getProfileDoctorById
};
