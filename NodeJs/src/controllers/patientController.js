import patientService from "../services/patientService";

let postBookingAppointment = async (req, res) => {
  try {
    let data = await patientService.postBookingAppointment(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log("get all code error: ", e);
    return res
      .status(200)
      .json({ errorCode: -1, errorMessage: "error from sever", e });
  }
};

let postVerifyBookingAppointment = async (req, res) => {
  try {
    let data = await patientService.postVerifyBookingAppointment(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log("get all code error: ", e);
    return res
      .status(200)
      .json({ errorCode: -1, errorMessage: "error from sever", e });
  }
};

module.exports = {
  postBookingAppointment,
  postVerifyBookingAppointment,
};
