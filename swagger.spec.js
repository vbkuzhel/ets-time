module.exports = {
  swagger: '2.0',
  info: {
    title: 'ETS - Selecto time tracking',
    description: '',
    version: '1.0.0',
    contact: {
      email: 'ipmazahell@gmail.com'
    },
    license: {
      name: 'MIT'
    }
  },
  host: 'localhost:1337',
  basePath: '/api/v1',
  tags: [
    {
      name: 'Authorization'
    }
  ],
  paths: {},
  definitions: {
    SignIn: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          required: true
        },
        password: {
          type: 'string',
          required: true
        }
      }
    },
    SignInResponseScheme: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          format: 'int64'
        }
      }
    }
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io'
  },
  _extra: {
    parameters: {
      authorization: {
        name: 'Authorization',
        in: 'header',
        description: 'JWT token',
        required: true,
        type: 'string'
      },
      SignIn: {
        in: 'body',
        name: 'body',
        schema: {
          $ref: '#/definitions/SignIn'
        }
      }
    },
    responses: {
      '201user': {
        description: 'User created'
      },
      '400validate': {
        description: 'Validation exception'
      },
      '401': {
        description: 'Unathorized'
      },
      '400': {
        description: 'Bad request'
      },
      '200': {
        description: 'OK'
      },
      '200user': {
        description: 'OK',
        schema: {
          $ref: '#/definitions/SignInResponseScheme'
        }
      }
    }
  }
};
