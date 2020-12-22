const wp = require('express').Router();
// const { response } = require('express');
const fetch = require('node-fetch');
const { WP_API_URL } = require('./urls.js');


wp.get('/',async (req, res, next)=>{
  if(!req.query.q) res.status(400).send('Bad Request!')
// console.log('URL is: ' + WP_API_URL)
  const perPage = '&per_page=10'
  const URL_APPEND =  
  req.query.q == 'food'? 'products?status=private' 
  : req.query.q == 'recipes'? 'posts?categories=39' 
  : req.query.q == 'blog'? 'posts?categories=40' // num 1 for uncategorized posts
  : null;

  const URL = WP_API_URL + URL_APPEND + perPage;
  const URL_MEDIA = WP_API_URL
 
  const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WP}`
    }
  const dataResponse =  fetch(URL, {
        headers: headers
      }).then(response => response.json())

      let getImages
      const promiseValues = [dataResponse]
  if(req.query.q === 'food') {
      console.log('Images are going to fetch')
        getImages = fetch(`${URL_MEDIA}media`, {
         headers: headers
       })
       .then(response => response.json())
        promiseValues.push(getImages)
     }
     await Promise.all(promiseValues).then(values => {
       if (promiseValues.length > 1) {
       console.log('sending: ' + req.query.q)
         console.log('sending images this one time only!')
        return res.send({results: values[0], images: values[1]})
       }
       console.log('sending: ' + req.query.q)
       res.send({results: values[0]})
      })
      .catch(e =>{
        // console.log(e)
         res.sendStatus(503)
      })
  })

  module.exports = wp;