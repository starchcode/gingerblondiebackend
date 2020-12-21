const {WP_URL} = require('./urls');
const fs = require("fs");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");


function tester(){ console.log('ok')}

function errorHandler(err){
    const status = err.status || 500;

const DATA = `-------------------
'we recieved an error @ ${new Date().toUTCString()} ${status}
here is your error:
${err}
-------------------
`
    console.log(DATA)
      fs.appendFile('error.txt', DATA, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });  
}

async function jwtRenewer() {
    try{

        console.log("renewing a jwt token: ");
        let body = {
          username: process.env.WP_USER,
          password: process.env.WP_PASS,
        };
        // console.log(body)
        await fetch(WP_URL + "wp-json/jwt-auth/v1/token", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            console.log("response received. going to convert");
            return response.json();
          })
          .then((jsonRes) => {
              if(jsonRes.token){
    
            console.log("here is your token: " + jsonRes.token);
      
            let texts = `IG_API_KEY=${process.env.IG_API_KEY} 
          APP_ID=${process.env.APP_ID} 
          APP_SECRET=${process.env.APP_SECRET}
          GMAIL=${process.env.GMAIL}
          PASS=${process.env.PASS}
          CAPTCHA_SECRET_KEY=${process.env.CAPTCHA_SECRET_KEY}
          MAIL_API=${process.env.MAIL_API}
          MAIL_LISTID=${process.env.MAIL_LISTID}
          WP=${jsonRes.token}
          WP_USER=${process.env.WP_USER}
          WP_PASS=${process.env.WP_PASS}`;
      
            fs.writeFile(".env", texts, function (err) {
              if (err) throw err;
              console.log('New WP JWT token written in the file!')
            });
        }else{
            throw Error('jwtToken automation: JWT did not recieve!: \n' + JSON.stringify(jsonRes))
        }
          
        });
    }catch(e){
        errorHandler(e);
    }
  }


//   IG toker renew
async function igTokenRenew() {
console.log('going to get a new IG token')

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL, // generated ethereal user
          pass: process.env.PASS, // generated ethereal password
        },
      });

      try{
    const ren = await fetch(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.IG_API_KEY}`
      );
      const jsonRes = await ren.json();
    
      if(jsonRes.access_token){
        let texts= `IG_API_KEY=${jsonRes.access_token} 
        APP_ID=${process.env.APP_ID} 
        APP_SECRET=${process.env.APP_SECRET}
        GMAIL=${process.env.GMAIL}
        PASS=${process.env.PASS}
        CAPTCHA_SECRET_KEY=${process.env.CAPTCHA_SECRET_KEY}
        MAIL_API=${process.env.MAIL_API}
        MAIL_LISTID=${process.env.MAIL_LISTID}
        WP=${process.env.WP}
        WP_USER=${process.env.WP_USER}
        WP_PASS=${process.env.WP_PASS}`

        fs.writeFile('.env', texts, function (err) {
            if (err) throw err;
            console.log('new IG token saved in file!')
          });
  
 
          let info = await transporter.sendMail(
            {
              from: "<thisisthegingerblondie@gmail.com>", // sender address
              to: "starchcode@gmail.com", // list of receivers
              subject: "The Ginger Blondie, NEW IG TOKEN!", // Subject line
              html: "Sir! <b>API KEY RENEWED!</b> <br> " + jsonRes.access_token // plain text body
              // html: "<b>Hello world?</b>", // html body
            },
            function (err, data) {
              if (err) {
                console.log("error: email did not send", err);
                throw Error(err);
              } else {
                console.log('new IG token sent to your email!')
              }
            }
          );  
      }else{
        throw Error('IG Token automation: IG Token did not recieve!: \n' + JSON.stringify(jsonRes))
      }
}catch(e){
    let info = await transporter.sendMail(
        {
          from: "<thisisthegingerblondie@gmail.com>", // sender address
          to: "starchcode@gmail.com", // list of receivers
          subject: "ERROR: IG Token! - GingerBlondie.ie", // Subject line
          html: "Sir! there was an error while renewing IG token" + e // plain text body
          // html: "<b>Hello world?</b>", // html body
        },
        function (err, data) {
          if (err) {
            console.log("error: email did not send", err);
          } else {
            console.log('Error occured while getting IG token. Email sent!')
          }
        }
      ); 

    errorHandler(e);
}
    }

module.exports = {tester, jwtRenewer, igTokenRenew}