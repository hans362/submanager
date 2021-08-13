const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const firebase = require('firebase-admin');
const db = firebase.database();

/*
用户基础信息
/users/info
*/
router.get('/info', (req, res) => {
    if (!uuid.validate(req.query.uuid)) {
        return res.status(400).send({ status: 'error', msg: 'Invalid UUID!' });
    }
});

/*
用户所有结点
/users/listNodes
*/
router.get('/listNodes', (req, res) => {
    if (!uuid.validate(req.query.uuid)) {
        return res.status(400).send({ status: 'error', msg: 'Invalid UUID!' });
    }
});

module.exports = router;
