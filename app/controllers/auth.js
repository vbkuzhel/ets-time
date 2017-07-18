'use strict';
const express = require('express');
const router = express.Router();
const knex = require('./../libs/knex');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Validator = require('./../middlewares/validators/Validator');
const { auth } = require('./../middlewares');
const env = require('./../config');
const jwt = require('jsonwebtoken');

const User = require('./../models/user');

/* Auth user */
/**
 * @route /auth
 * @method POST
 * @tags Authorization
 * @operationId login
 * @summary Sign In
 * @description Create new user
 * @body SignIn
 * @responses 201user,400validate,200user
 */

router.post('/', (req, res, next) => {
  const rules = {
    email: 'required|email|email_exist',
    password: 'required|min:5'
  };

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    // get email and check password
    knex('users')
      .where('email', req.body.email)
      .select('id', 'password')
      .where('locked', 0)
      .first()
      .then(data => {
        if (data) {
          if (bcrypt.compareSync(req.body.password, data.password)) {
            // generate token
            const token = jwt.sign({ id: data.id }, env.secret, { expiresIn: '120d' });
            User.getById(data.id, (err, user) => {
              if (err) return next(err);
              if (user) {
                user['token'] = token;
                return res.json(user);
              }
            });
          } else {
            res.status(401).send();
          }
        } else {
          res.status(401).send();
        }
      })
      .catch(next);
  });
  validate.fails(() => res.status(400).send(validate.errors));
});

/* Me */
/**
 * @route /auth/me
 * @method GET
 * @tags Authorization
 * @operationId me
 * @summary Get information about current user
 * @headers authorization
 * @responses 200,401
 */
router.get('/me', auth, (req, res) => res.json(req._user));

module.exports = router;
