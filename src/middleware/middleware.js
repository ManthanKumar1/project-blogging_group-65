const jwt = require("jsonwebtoken")
const { default: mongoose } = require("mongoose")
const blogModel = require("../models/blogModel")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) {
            return res.status(404).send({ status: false, msg: "token must be present" })
        }

        let decodedToken = jwt.verify(token, "manthan_sanket_suyash_satyajit_group_65")
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" })
        }
        req.token = decodedToken
        next()
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

const authorisation = async function (req, res, next) {
    try {
        let blogId = req.params.blogId
        let findBlog = await blogModel.findById(blogId);
        if (findBlog) {
            if (req.token.userId != findBlog.authorId) {
                return res.status(403).send({ status: false, msg: "Author is not authorized to access this data" });
            }
        }
        next()
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}

const authorisationForCreateBlog = async function (req, res, next) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0){
            return res.status(403).send({ status: false, msg: "body can not be empty" }); 
        }
        let authorId = req.body.authorId
        if (!mongoose.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, msg: "authorId is not valid" })
        }
        if (req.token.userId != authorId) {
            return res.status(403).send({ status: false, msg: "author is not authorized to create blogs" });
        }
        next()
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}
module.exports.authentication = authentication
module.exports.authorisation = authorisation
module.exports.authorisationForCreateBlog = authorisationForCreateBlog