import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Adify API',
      version: '1.0.0',
      description: 'API documentation for Adify - Contextual ad and service engine for parking sessions',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'Adify Support',
        url: 'https://adify.example.com',
        email: 'support@adify.example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Member: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The member ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'The member name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The member email',
              example: 'john.doe@example.com',
            },
            contact: {
              type: 'string',
              description: 'The member contact number',
              example: '+10000000000',
            },
            vehicles: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Vehicle registration numbers',
              example: ['ABC123', 'XYZ789'],
            },
            cardDetails: {
              type: 'object',
              properties: {
                cardNumber: {
                  type: 'string',
                  description: 'Last 4 digits of card number',
                  example: '4958',
                },
                expiryDate: {
                  type: 'string',
                  description: 'Card expiry date',
                  example: '02/2024',
                },
                cvv: {
                  type: 'string',
                  description: 'Card CVV number',
                  example: '535',
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Ad: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The ad ID',
              example: 1,
            },
            advertiserId: {
              type: 'integer',
              description: 'The advertiser ID',
              example: 1,
            },
            adUrl: {
              type: 'string',
              description: 'The ad URL',
              example: 'https://example.com/ad1',
            },
            imageUrl: {
              type: 'string',
              description: 'The ad image URL',
              example: 'https://example.com/image1.jpg',
            },
            locationIds: {
              type: 'array',
              items: {
                type: 'integer',
              },
              description: 'Location IDs where ad is displayed',
              example: [1, 2, 3],
            },
            costToClick: {
              type: 'number',
              format: 'float',
              description: 'Cost per click',
              example: 0.5,
            },
            categoryId: {
              type: 'integer',
              description: 'Category ID of the ad',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'mike.cooper@example.com',
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'adify123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Logged in successfully',
            },
            data: {
              type: 'object',
              properties: {
                sessionToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                member: {
                  $ref: '#/components/schemas/Member',
                },
              },
            },
          },
        },
        AdClick: {
          type: 'object',
          properties: {
            adId: {
              type: 'integer',
              description: 'The ad ID',
              example: 1,
            },
            memberId: {
              type: 'integer',
              description: 'The member ID',
              example: 5,
            },
            transactionId: {
              type: 'integer',
              description: 'The transaction ID',
              example: 123,
            },
            isClicked: {
              type: 'boolean',
              description: 'Whether the ad was clicked',
              example: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Error details',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

export default {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }),
  specs,
}; 