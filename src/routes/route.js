const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middleware = require("../middleware/middleware")

//Author
router.post("/authors", authorController.createAuthor) //Create Author
router.post("/login", authorController.login)

//Blog
router.post("/blogs", middleware.authentication,middleware.authorisationForCreateBlog, blogController.createBlog) //Create Blog
router.get("/blogs", middleware.authentication, blogController.getBlog) //Get All Blogs
router.put("/blogs/:blogId", middleware.authentication,middleware.authorisation, blogController.updateBlog) //Update Blog
router.delete("/blogs/:blogId",middleware.authentication,middleware.authorisation, blogController.deleteBlog) //Delete Blog by Specific Id
router.delete("/blogs",middleware.authentication, blogController.deleteBlogByQuery) //Delete Blog by Using Query

router.all("/*/",async function(req, res){
    return res.status(404).send({status:false, message: "page not found"})
})

module.exports = router;