'use strict';
const policies = require('../services/policies');
import {makeUrlRequest} from '../services/onepayHelper';

const express = require('express');
const router = express.Router();

router.get('/', policies.isAuthenticated,  function(req, res) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
  let postParams = req.query;
  postParams['vpc_TicketNo'] = ip;
  let urlRequest = makeUrlRequest(postParams);
  
  return res.redirect(urlRequest);
});

router.get('/finally', function(req, res) {
  res.status(200).json('ok');
});

export default router;