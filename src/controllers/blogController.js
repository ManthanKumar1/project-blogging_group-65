const AuthorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")

//--------------------------------------common validation function-------------------------------------------//
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "number") return false;
    return true
}
const isValidBody = function (value) {
    if (Object.keys(value).length == 0) return true
    return false
}
//------------------------------------------create blog api-------------------------------------------------//
const createBlog = async function (req, res) {
    try {
        let blogData = req.body
        if (isValidBody(blogData)) {
            return res.status(400).send({ status: false, msg: "body is requred" })
        }
        const { title, body, authorId, tags, category, subcategory, isPublished } = blogData // Destructuring
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is required" })
        }

        if (!isValid(body)) {
            return res.status(400).send({ status: false, msg: "Body is required" })
        }

        if (!mongoose.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, msg: "authorId is not valid" })
        }
        const authorCheck = await AuthorModel.findOne({ _id: authorId })
        if (!authorCheck) {
            return res.status(404).send({ status: false, msg: "author is not registered" })
        }
        if (tags) {
            if (typeof (tags) != "object" || Object.keys(tags).length == 0) {
                return res.status(400).send({ status: false, msg: "Tags should be in array of string" })
            }
            const result = tags.some(element => {
                if (!isValid(element)) return true
                return false
            })
            if (result) {
                return res.status(400).send({ status: false, msg: "blank string and number is not allowed" })
            }
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "Category should be string" })
        }
        if (subcategory) {
            if (typeof (subcategory) != "object" || Object.keys(subcategory).length == 0) {
                return res.status(400).send({ status: false, msg: "subcategory should be in array of string" })
            }
            const result = subcategory.some(element => {
                if (!isValid(element)) return true
                return false
            })
            if (result) {
                return res.status(400).send({ status: false, msg: "blank string and number is not allowed" })
            }
        }

        if (isPublished) {
            if (!isValid(isPublished)) {
                return res.status(400).send({ status: false, msg: "isPublished value is required in boolean" })
            }
            let value = [true, false]
            if (!value.includes(isPublished)) {
                return res.status(400).send({ status: false, msg: "is published should be in boolean" })
            }
        }


        if (isPublished == true) {
            blogData.publishedAt = new Date()
        }

        console.log(blogData)
        const blog = await blogModel.create(blogData)

        res.status(201).send({ status: true, data: blog })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const getBlog = async function (req, res) {
    try {
        const query = req.query
        const { authorId, category, tags, subcategory } = query
        if (authorId == '') {
            return res.status(404).send({ status: false, msg: "authorId is required" })
        }
        if (authorId) {
            if (!mongoose.isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, msg: "authorId is not valid" })
            }
            const authorCheck = await AuthorModel.findOne({ _id: authorId })
            if (!authorCheck) {
                return res.status(404).send({ status: false, msg: "author is not registered" })
            }
        }
        if (category == '') {
            return res.status(404).send({ status: false, msg: "category is required" })
        }
        if (tags == '') {
            return res.status(404).send({ status: false, msg: "tags is required" })
        }
        if (subcategory == '') {
            return res.status(404).send({ status: false, msg: "subcategory is required" })
        }

        const blogs = await blogModel.find({ $and: [query, { isDeleted: false }, { isPublished: true }] })
        if (blogs.length == 0) {
            return res.status(404).send({ status: false, msg: "blog may deleted or unpublished" })
        }
        return res.status(200).send({ status: true, data: blogs })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const updateBlog = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(404).send({ msg: "No data for Update" })
        }
        let param = req.params.blogId
        if (!param) {
            return res.status(400).send({ msg: "id is mandatory" })
        }
        let checkId = await blogModel.findById({ _id: param })
        if (!checkId) {
            return res.status(404).send({ msg: "no Blogid found" })
        }
        if (checkId.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "blog is already deleted" })
        }
        const { title, body, tags, category, subcategory, isPublished } = data // Destructuring
        if (title) {
            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: "Title is required" })
            }
        }

        if (body) {
            if (!isValid(body)) {
                return res.status(400).send({ status: false, msg: "Body is required" })
            }
        }

        if (tags) {
            if (typeof (tags) != "object" || Object.keys(tags).length == 0) {
                return res.status(400).send({ status: false, msg: "Tags should be in array of string" })
            }
            const result = tags.some(element => {
                if (!isValid(element)) return true
                return false
            })
            if (result) {
                return res.status(400).send({ status: false, msg: "blank string and number is not allowed" })
            }
        }
        if (category) {
            if (!isValid(category)) {
                return res.status(400).send({ status: false, msg: "Category should be string" })
            }
        }

        if (subcategory) {
            if (typeof (subcategory) != "object" || Object.keys(subcategory).length == 0) {
                return res.status(400).send({ status: false, msg: "subcategory should be in array of string" })
            }
            const result = subcategory.some(element => {
                if (!isValid(element)) return true
                return false
            })
            if (result) {
                return res.status(400).send({ status: false, msg: "blank string and number is not allowed" })
            }
        }

        if (isPublished) {
            if (!isValid(isPublished)) {
                return res.status(400).send({ status: false, msg: "isPublished value is required in boolean" })
            }
            let value = [true, false]
            if (!value.includes(isPublished)) {
                return res.status(400).send({ status: false, msg: "is published should be in boolean" })
            }
        }

        let updateData = { title: data.title, body: data.body, $push: { tags: data.tags, subcategory: data.subcategory }, isPublished: data.isPublished }

        if (isPublished == true) {
            updateData.publishedAt = new Date()
        }
        console.log(updateData)
        let data1 = await blogModel.updateMany({ _id: param }, updateData, { new: true })


        res.status(200).send({ status: true, msg: data1 })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const deleteBlog = async function (req, res) {
    try {
        let id = req.params.blogId
        if (!id) {
            return res.status(400).send({ msg: "id is mandatory" })
        }
        let checkId = await blogModel.findById(id)
        if (!checkId) {
            return res.status(404).send({ msg: "id is incorrect" })
        }
        if (checkId.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "blog is already deleted" })
        }
        let checkDelete = await blogModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })
        res.status(200).send({ status: true, msg: "delete done" })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const deleteBlogByQuery = async function (req, res) {
    try {
        let query = req.query

        if (Object.keys(query).length == 0) {
            return res.status(400).send({ status: false, msg: "Query Params cannot be empty" })
        }

        const { authorId, category, tags, subcategory, isPublished } = query
        if (authorId == '') {
            return res.status(404).send({ status: false, msg: "authorId is required" })
        }
        if (authorId) {
            if (!mongoose.isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, msg: "authorId is not valid" })
            }
            const authorCheck = await AuthorModel.findOne({ _id: authorId })
            if (!authorCheck) {
                return res.status(404).send({ status: false, msg: "author is not registered" })
            }
        }
        if (category == '') {
            return res.status(404).send({ status: false, msg: "category is required" })
        }
        if (tags == '') {
            return res.status(404).send({ status: false, msg: "tags is required" })
        }
        if (subcategory == '') {
            return res.status(404).send({ status: false, msg: "subcategory is required" })
        }
        if (isPublished == '') {
            return res.status(404).send({ status: false, msg: "ispublished is required" })
        }
        if (isPublished) {
            let value = [true, false]
            if (!value.includes(isPublished)) {
                return res.status(400).send({ status: false, msg: "is published should be in boolean" })
            }
        }
        query.isDeleted = false

        let deleteBlogs = await blogModel.updateMany(query, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (deleteBlogs.matchedCount == 0) {
            return res.status(404).send({ status: false, msg: "Blog Not Found or deleated" })
        }

        res.status(200).send({ status: true, msg: "Document is deleted" })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery