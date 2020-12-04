const send = require('express').Router();
const nodemailer = require("nodemailer");


//to grab a starting code
send.get("/", async (req, res) => {
    let code = req.query.code;
  console.log('here...')
    if(code){
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL, // generated ethereal user
        pass: process.env.PASS, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail(
      {
        from: "<starchcode@gmail.com>", // sender address
        to: "starchcode@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hi, Here is your code Mr.Dave!: " + code, // plain text body
        // html: "<b>Hello world?</b>", // html body
      },
      function (err, data) {
        if (err) {
          console.log("error: email did not send", err);
          res.send("this could not be processed!");
        } else {
          res.send("Thank you! It's all done!");
        }
      }
    );
  }else{
      res.send('Error! contact starchCode.')
  }
  });
  

send.get("/currentkey", async (req, res) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL, // generated ethereal user
        pass: process.env.PASS, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail(
      {
        from: "<starchcode@gmail.com>", // sender address
        to: "starchcode@gmail.com", // list of receivers
        subject: "current API key", // Subject line
        text: "Hi, Here is your current API key Mr.Dave!: " + process.env.IG_API_KEY, // plain text body
      },
      function (err, data) {
        if (err) {
          console.log("error: email did not send", err);
          res.send("this could not be processed!");
        } else {
          res.send("Thank you! It's all done!");
        }
      }
    );
  })
  module.exports = send;