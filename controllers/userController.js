const user = require('../models/userSchema')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter } = require('../services/emailService');
 


// API for creater user
const addUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        const hashPassword = await bcrypt.hashSync(userPassword, 10)
        const fileNames = req.files.map((file) => file.filename);

        const userData = await user.create({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: hashPassword,
            userProfile : fileNames
        })
        res.status(200).json(userData)
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// API for login user
const loginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        const isUserLogin = await user.findOne({
            where: {
                userEmail: req.body.userEmail,
            }
        })
        if (isUserLogin !== null) {
            const pwdComfirm = await bcrypt.compare(userPassword, isUserLogin.userPassword)
            if (pwdComfirm && isUserLogin) {
                const token = jwt.sign({ id: isUserLogin._id }, process.env.jwt, { expiresIn: "20m" })
                res.status(200).json({
                    success: true,
                    message: "login successfully",
                    isUserLogin,
                    token
                })
            } else {
                res.status(401).json({
                    status: false,
                    message: "Please Enter correct username and password",
                });
            }
        } else {
            res.status(500).json({
                status: false,
                message: "this email is not registered",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// API for resetPassword
const resetPassword = async (req,res)=>{
    const { userEmail } = req.body;
    const userData = await user.findOne({
        where : {
            userEmail : req.body.userEmail
        }
    }) 
    console.log(userData)
    if(userData !== null ){
        const secret = process.env.jwt;
        const token = jwt.sign({userId : userData._id}, secret, { expiresIn : "20m" })
        const link = `http://127.0.0.1:7000/reset/${userData._id}/${token}`;
        await transporter.sendMail({
            from :"sendMailer",
            to : userEmail,
            subject : "Password reset ",
            html: `<a href=${link}>Click on link to reset your password `,
        })
        return res.status(200).json({
            success : true,
            message : "Password update successfully",
            token,
            id : userData._id
        })
    }else{
        res.status(403).json({
            success : false,
            message : "Password are not updated",
        })
    }
    
}
module.exports = { addUser, loginUser, resetPassword }
