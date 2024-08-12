const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const {verifyJwtAuth} = require('./verifyAuth')
env.config();
const app = express();
app.use(express.json());
app.listen(5000);
  
const users = [{name: "Ravichandran", pass: "Mohan"}]
app.get('/users', (req,res) => {
    res.json(users)
});
 
app.post('/users', async (req, res) => {    
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(req.body.pass, salt);
    const userObj = {name: req.body.name, pass: hashedPass};
    users.push(userObj);
    res.status(401).json(userObj);
});

app.post('/user/login', async (req, res) => {
    const userData = users.find((user) => {
        return user.name === req.body.name;
    });
    console.log(userData);
    
    if(!userData) {
        return res.status(401).json({status: 'User Not Found'});
    }
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU29udSIsInBhc3MiOiIkMmIkMTAkMVRFUHl5d2VxRmJxQ3MvTjQ0bGJ6ZThwMDMxY0pTMU4xRHFEQ0NrVkswUGE4S3J3VGpIazYiLCJpYXQiOjE3MjM0NzE2MTYsImV4cCI6MTcyMzQ3MTYxN30.L_exnWIYIhSPBH2jcARcuRONIV_bZDaNNaIkbcqE_aU
    /* the first . it will check jwt type like jwt and hs256
     And the second dot is payload
     third on is for sectet value for the app */
    //To use config file to access values use below 
    const token = jwt.sign(userData, process.env.My_SECRET, {
        expiresIn: '1m'
    });
    res.cookie('token', token, {httpOnly: true});
    const validatePass = await bcrypt.compare(req.body.pass, userData.pass);
    res.status(200).json({"status": validatePass});
});
 
//For validate authorization token
app.get('/validateUsers',verifyJwtAuth, (req, res) => {
    res.json(users)
});
 