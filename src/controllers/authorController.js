const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
//-------------------------------------------common validation function--------------------------------------//
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "number") return false
    return true
}
const isValidBody = function (value) {
    if (Object.keys(value).length == 0) return true
    return false
}
const fnameRegex = new RegExp(/^[a-z\s]+$/i)
const lnameRegex = new RegExp(/^[a-z\s]+$/i)
const emailRegex = new RegExp(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
//-------------------------------------------create  author api-----------------------------------------//
const createAuthor = async function (req, res) {
    try {
         //checking body validation
        let authorData = req.body
        if (isValidBody(authorData)) {
            return res.status(400).send({ status: false, msg: "all fields are required" })
        }
        const { fname, lname, title, email, password } = authorData // Destructuring
         //checking fname validation
        if (!isValid(fname))  {
            return res.status(400).send({ status: false, msg: "fname is required" })
        }
        if(!fnameRegex.test(fname)){
            return res.status(400).send({ status: false, msg: "fname is only alphabetic" })
        }
         //checking lname validation
        if (!isValid(lname)){
            return res.status(400).send({ status: false, msg: "lname is required" })
        }
        if(!lnameRegex.test(lname)) {
            return res.status(400).send({ status: false, msg: "lname is only alphabetic" })
        }
         //checking title validation
        if (!isValid(title)){
            return res.status(400).send({ status: false, msg: "Title is required" })
        }
        if(title != "Mr" && title != "Mrs" && title != "Miss"){
            return res.status(400).send({ status: false, msg: "Title can only be Mr, Mrs or Miss" })   
        }
         //checking email validation
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: " Email is required in string" })
        }
        if(!emailRegex.test(email)){
            return res.status(400).send({ status: false, msg: "Invalid Email" })
        }
        let duplicateEmail = await authorModel.findOne({ email: email })

        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: "email is already exist" })
        }
         //checking password validation
        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }

        const author = await authorModel.create(authorData)

        return res.status(201).send({ status: true, data: author })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const login = async function (req, res) {
    try {
         //checking body validation
         let loginData = req.body
         if (isValidBody(loginData)) {
             return res.status(400).send({ status: false, msg: "all fields are required" })
         }
         const { email, password} = loginData // Destructuring
         //checking email validation
         if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: " Email is required in string" })
        }
        if(!emailRegex.test(email)){
            return res.status(400).send({ status: false, msg: "Invalid Email" })
        }
        let user = await authorModel.findOne({email: email })
        if (!user) {
            return res.status(401).send({ status: false, msg: "email id is not registered" })
        }
        //checking password validation
        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "password is required"})
        }
        let user1 = await authorModel.findOne({email: email,password: password })
        if (!user1) {
            return res.status(401).send({ status: false, msg: "password is incorect" })
        }
        //creating jwt
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                userName: user.fname + " " + user.lname,
                group: 65
            },
            "manthan_sanket_suyash_satyajit_group_65"
        )
        return res.status(200).send({ status: true, msg: token })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createAuthor = createAuthor
module.exports.login = login