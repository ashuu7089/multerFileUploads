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
            userProfile: fileNames
        })
        res.status(200).json(userData)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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
const resetPassword = async (req, res) => {
    const { userEmail } = req.body;
    const userData = await user.findOne({
        where: {
            userEmail: req.body.userEmail
        }
    })
    if (userData !== null) {
        const secret = process.env.jwt;
        const token = jwt.sign({ userId: userData.id }, secret, { expiresIn: "20m" })
        const link = `http://127.0.0.1:7000/reset/${userData._id}/${token}`;
        await transporter.sendMail({
            from: "sendMailer",
            to: userEmail,
            subject: "Password reset ",
            body: "Beta yha pr click kro ",
            html: `<a href=${link}>Click on link to reset your password `,
        })
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
            token,
            id: userData.id
        })
    } else {
        res.status(403).json({
            success: false,
            message: "Password are not updated",
        })
    }

}

// API for forgetPassword
const forgetPass = async (req, res) => {
    const { userId, token } = req.params;
    const newPassword = req.body.newPassword;

    try {
        const userData = await user.findByPk(userId)
        console.log("***", userData)
        if (!userData) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const secret = process.env.jwt;
        console.log(secret)
        jwt.verify(token, secret, async (err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err.message
                })
            }
        })
        if (!userId) {
            res.status(400).json({
                status: false,
                message: "invalid user Id"
            })
        } else {
            const hashPassword = await bcrypt.hash(newPassword, 10);
            userData.userPassword = hashPassword;
            console.log("123", hashPassword)
            await userData.save();
            res.status(200).json({
                success: true,
                message: "password updated"
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
module.exports = { addUser, loginUser, resetPassword, forgetPass }
