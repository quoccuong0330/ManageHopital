import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/CRUD", homeController.getCRUD);

  router.post("/CRUD/create", homeController.createUser);
  router.get("/CRUD/read", homeController.readUserList);
  router.get("/CRUD/detail/:id", homeController.detailUser);
  router.post("/CRUD/update/:id", homeController.updateUser);
  router.post("/CRUD/delete/:id", homeController.deleteUser);

  //API
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUser);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.put("/api/edit-user", userController.handleEditUser);

  router.get("/api/allcode", userController.getAllCode);

  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);

  router.get("/api/get-all-doctors", doctorController.getAllDoctor);
  router.post("/api/save-info-doctors", doctorController.saveInfoDoctor);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );
  router.post(
    "/api/bulk-create-schedule",
    doctorController.handleBulkCreateSchedule
  );

  router.get(
    "/api/schedule-doctor-by-date",
    doctorController.getScheduleDoctorByDate
  );
  router.get(
    "/api/extra-info-doctor-by-id",
    doctorController.getExtraInfoDoctorById
  );
  router.get(
    "/api/profile-doctor-by-id",
    doctorController.getProfileDoctorById
  );

  router.post(
    "/api/patient-book-appointment",
    patientController.postBookingAppointment
  );

  router.post(
    "/api/verify-booking-appointment",
    patientController.postVerifyBookingAppointment
  );

  router.post(
    "/api/create-new-specialty",
    specialtyController.createNewSpecialty
  );

  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get("/api/get-detail-specialty-by-id", specialtyController.getDetailSpecialtyById);

  return app.use("/", router);
};

module.exports = initWebRoutes;
