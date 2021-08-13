const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const firebase = require('firebase-admin');
const db = firebase.database();

const transporter = nodemailer.createTransport({
    host: process.env.smtp_host,
    port: process.env.smtp_port,
    secure: process.env.smtp_ssl_enable,
    auth: {
        user: process.env.smtp_username,
        pass: process.env.smtp_password,
    },
});

/*
生成验证码
/register/captcha
*/
router.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create({ noise: 5, color: true });
    req.session.captcha = captcha.text.toLowerCase();
    res.type('svg');
    res.status(200).send(captcha.data);
});

/*
注册新的 UUID
/register/submit
*/
router.post('/submit', (req, res) => {
    const captcha = req.body.captcha.toLowerCase();
    if (captcha !== req.session.captcha) {
        return res.status(403).send({ status: 'error', msg: 'Invalid Captcha!' });
    }
    delete req.session.captcha;
    const email = req.body.email;
    const validator = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!validator.test(email)) {
        return res.status(400).send({ status: 'error', msg: 'Invalid Email!' });
    }
    const newUUID = uuid.v4();
    const mailOptions = {
        from: 'SubManager' + process.env.smtp_username,
        to: email,
        subject: 'Your New SubManager UUID',
        text: newUUID,
    };
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            return res.status(500).send({ status: 'error', msg: error });
        }
        res.status(200).send({ status: 'ok', msg: response });
    });
});

module.exports = router;
