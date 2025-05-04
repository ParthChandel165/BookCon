const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WBD Project API",
      version: "1.0.0",
      description: "API documentation for B2B and B2C endpoints (REST + GraphQL)",
    },
    servers: [
      {
        url: "http://localhost:8000", // or your server URL
      },
    ],
  },
  apis: ["./controllers/*.js"], // path to your controller files
};

const specs = swaggerJsDoc(options);

const setupSwaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwaggerDocs;
