const food = require('express').Router();
// const { response } = require('express');
const fetch = require('node-fetch');

food.get('/',async (req, res, next)=>{
    const URL = 'http://localhost:8888/wp-json/wp/v2/products?status=private';
    const URL_MEDIA = 'http://localhost:8888/wp-json/wp/v2/'
  //   const myBody = {
  //     "title": "test",
  //     "content": "this is a test from postman",
  //     "status": "publish"
  // }  
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WP}`
    }
    const dataResponse =  fetch(URL, {
        headers: headers
      }).then(response => response.json())

      const getImages =  fetch(`${URL_MEDIA}media`, {
        headers: headers
      })
      .then(response => response.json())
      // .catch(e => res.sendStatus(404))

      Promise.all([dataResponse, getImages]).then(values => {
       res.send({results: values[0], images: values[1]})
      })
      .catch(e =>{
        // console.log(e)
         res.sendStatus(503)
      })
  })

  module.exports = food;