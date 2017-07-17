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
  host: 'http://localhost:1337',
  basePath: '/api/v1',
  schemes: ['http'],
  paths: {
    '/pet': {
      post: {
        summary: 'Some info',
        description: 'desc',
        operationId: 'per',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'query',
            name: 'q',
            description: 'description of body',
            required: true,
            default: 'hello',
            schema: '#/definitions/Pet'
          }
        ],
        responses: {
          '201': {
            description: 'User successfully created'
          },
          '400': {
            description: 'Bad request'
          }
        }
      }
    }
  },
  definitions: {},
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io'
  }
};
