const express = require("express")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const router = express.Router()
const postController = require("../controllers/post")

//ACCESS POINTS : END POINTS
router.get("/", auth, postController.getAllPosts)
router.get("/:id", auth, postController.getOnePost)
router.post("/", auth, multer, postController.createPost)
router.put("/:id", auth, multer, postController.modifyPost)
router.post("/:id/react", auth,postController.reactPost)
router.post("/:id/comment", auth, multer,postController.createComment)
router.delete("/:id", auth, postController.deletePost)
router.get('/:id/comments', auth, postController.getComments)

module.exports=router