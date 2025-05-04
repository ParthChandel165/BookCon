const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BookCon API Documentation",
            version: "1.0.0",
            description:
                "API documentation for BookCon e-commerce platform - a multi-vendor book marketplace",
            contact: {
                name: "BookCon Support",
                email: "support@bookcon.com",
            },
        },
        servers: [
            {
                url: "http://localhost:8000/api/v2",
                description: "Development server",
            },
        ],
        tags: [
            {
                name: "User",
                description: "User authentication and profile management",
            },
            {
                name: "Shop",
                description: "Seller shop operations and management",
            },
            { name: "Product", description: "Book product operations" },
            { name: "Event", description: "Book events and promotions" },
            { name: "Order", description: "Order management and processing" },
            { name: "Payment", description: "Payment processing methods" },
            { name: "Coupon", description: "Discount coupon operations" },
            { name: "Withdraw", description: "Seller withdraw operations" },
            { name: "Message", description: "User-seller messaging" },
            {
                name: "Conversation",
                description: "Message conversation management",
            },
            { name: "Admin", description: "Admin operations" },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token",
                },
                sellerCookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "seller_token",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        avatar: { type: "string" },
                        role: { type: "string" },
                        addresses: { type: "array", items: { type: "object" } },
                    },
                },
                Shop: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        avatar: { type: "string" },
                        description: { type: "string" },
                        address: { type: "string" },
                        phoneNumber: { type: "number" },
                        availableBalance: { type: "number" },
                    },
                },
                Product: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        category: { type: "string" },
                        price: { type: "number" },
                        discountPrice: { type: "number" },
                        stock: { type: "number" },
                        images: { type: "array", items: { type: "string" } },
                        shopId: { type: "string" },
                    },
                },
                Order: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        cart: { type: "array", items: { type: "object" } },
                        shippingAddress: { type: "object" },
                        user: { type: "object" },
                        totalPrice: { type: "number" },
                        status: { type: "string" },
                        paymentInfo: { type: "object" },
                    },
                },
                Coupon: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        value: { type: "number" },
                        minAmount: { type: "number" },
                        maxAmount: { type: "number" },
                        shopId: { type: "string" },
                    },
                },
                Withdraw: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        seller: { type: "object" },
                        amount: { type: "number" },
                        status: { type: "string" },
                    },
                },
                Event: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        category: { type: "string" },
                        start_Date: { type: "string", format: "date-time" },
                        Finish_Date: { type: "string", format: "date-time" },
                        status: { type: "string" },
                        tags: { type: "string" },
                        originalPrice: { type: "number" },
                        discountPrice: { type: "number" },
                        stock: { type: "number" },
                        images: { type: "array", items: { type: "string" } },
                        shopId: { type: "string" },
                    },
                },
                Message: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        conversationId: { type: "string" },
                        sender: { type: "string" },
                        text: { type: "string" },
                        images: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Conversation: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        members: { type: "array", items: { type: "string" } },
                        groupTitle: { type: "string" },
                        lastMessage: { type: "string" },
                        lastMessageId: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    },
    apis: ["./controller/*.js", "./swagger/*.yaml"], // Make sure this path is correct
};

const specs = swaggerJsDoc(options);

const setupSwaggerDocs = (app) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, {
            explorer: true,
            customCss: `
      .swagger-ui .topbar { background-color: #212121; }
      .swagger-ui .info .title { color: #333; font-weight: bold; }
      .swagger-ui .scheme-container { background-color: #f8f8f8; }
      .swagger-ui .opblock.opblock-get { background: rgba(97, 175, 254, 0.1); }
      .swagger-ui .opblock.opblock-post { background: rgba(73, 204, 144, 0.1); }
      .swagger-ui .opblock.opblock-put { background: rgba(252, 161, 48, 0.1); }
      .swagger-ui .opblock.opblock-delete { background: rgba(249, 62, 62, 0.1); }
      .swagger-ui .opblock-tag { font-size: 20px; }
      .swagger-ui .opblock-summary-description { font-size: 13px; }
    `,
            customSiteTitle: "BookCon API Documentation",
        })
    );
};

module.exports = setupSwaggerDocs;
