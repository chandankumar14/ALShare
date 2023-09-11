const express = require("express")
const Router = express.Router()

Router.get(`/`, (req, res) => {
    res.send('Hello World! this is first route configure')
  });

  module.exports  =  Router
