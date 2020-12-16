const wp = require('express').Router();
// const { response } = require('express');
const fetch = require('node-fetch');

wp.get('/',async (req, res, next)=>{
  if(!req.query.q) res.status(400).send('Bad Request!')

  const perPage = '&per_page=10'
  const URL_APPEND =  
  req.query.q == 'food'? 'products?status=private' 
  : req.query.q == 'recipes'? 'posts?categories=39' 
  : req.query.q == 'blog'? 'posts?categories=40' // num 1 for uncategorized posts
  : null;

  const URL = 'http://localhost:8888/wp-json/wp/v2/' + URL_APPEND + perPage;
  const URL_MEDIA = 'http://localhost:8888/wp-json/wp/v2/'
 
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

  module.exports = wp;