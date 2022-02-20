const express = require("express")
const multer = require("../middleware/multer-config")
const router = express.Router()
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

//ACCESS POINTS
router.post("/signup", userController.signup)
router.post("/login", userController.login)
router.delete("/delete", userController.delete)
router.get("/profile/:id", userController.profile)
router.put("/modify", multer, userController.modify)
router.get("/role", userController.role)

module.exports=router