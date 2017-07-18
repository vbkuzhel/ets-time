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
 * @route auth/login
 * @method POST
 * @tag Authorization
 * @operationId login
 * @summary Create new user
 * @description Create new user
 * @headers authorization
 * @body email,password
 * @scheme createdUser
 * @responses 201=User successfully created, 400
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
 * @route auth/me
 * @method HEAD
 * @tag Authorization
 * @operationId me
 * @summary Get information about current user
 * @headers authorization
 * @scheme User
 * @responses 200
 */

/**
 * @route auth/me
 * @method GET
 * @tag Authorization
 * @operationId me
 * @summary Get information about current user
 * @headers authorization
 * @scheme User
 * @responses 200
 */
router.get('/me', auth, (req, res) => res.json(req._user));

module.exports = router;
