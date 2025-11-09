import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Clothica API',
      version: '1.0.0',
      description: 'API документація для Clothica',
      contact: {
        name: 'Clothica API Team',
        email: 'maliukolexandr@gmail.com',
      },
    },
    servers: [
      {
        url: 'https://clothica-api-team-work.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
      schemas: {
        OrderItem: {
          type: 'object',
          properties: {
            goodId: { type: 'string' },
            quantity: { type: 'integer', minimum: 1 },
            size: { type: 'string' },
            gender: { type: 'string' },
          },
          required: ['goodId', 'quantity'],
        },
        PriceObject: {
          type: 'object',
          properties: {
            value: { type: 'number' },
            currency: {
              type: 'string',
              enum: ['грн', 'USD', 'EUR'],
              default: 'грн',
            },
          },
          required: ['value'],
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            orderNumber: { type: 'string' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
            deliveryCost: { $ref: '#/components/schemas/PriceObject' },
            totalPrice: { $ref: '#/components/schemas/PriceObject' },
            status: {
              type: 'string',
              enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
              default: 'Pending',
            },
            shippingAddress: { type: 'string' },
            contactPhone: { type: 'string' },
            comment: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: [
            'items',
            'deliveryCost',
            'totalPrice',
            'shippingAddress',
            'contactPhone',
          ],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
