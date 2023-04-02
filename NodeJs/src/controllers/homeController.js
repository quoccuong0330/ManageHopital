import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render("getCRUDPage.ejs");
};

let createUser = async (req, res) => {
  await CRUDService.createNewUser(req.body);
  return res.redirect("/CRUD/read");
};

let readUserList = async (req, res) => {
  let data = await CRUDService.getAllUser();
  console.log(data.length);
  // return res.send("Successfully");
  return res.render("readCRUD.ejs", { data: data });
};

let detailUser = async (req, res) => {
  let userId = req.params.id;
  let data = await CRUDService.findUserById(userId);
  // return res.send(JSON.stringify(data));

  return res.render("detailCRUD.ejs", { dataEdit: data });
};

let updateUser = async (req, res) => {
  let data = req.body;
  await CRUDService.updateUser(data);
  return res.redirect("/CRUD/read");
};

let deleteUser = async (req, res) => {
  let id = req.params.id;
  await CRUDService.deleteUser(id);
  return res.redirect("/CRUD/read");
};

module.exports = {
  getHomePage,
  getCRUD,
  createUser,
  readUserList,
  detailUser,
  updateUser,
  deleteUser,
};
