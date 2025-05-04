const { isAuthenticated, isSeller, isAdmin } = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const User = require("../../model/user");
const Shop = require("../../model/shop");
const ErrorHandler = require("../../utils/ErrorHandler");

// Mock dependencies
jest.mock("../../model/user");
jest.mock("../../model/shop");
jest.mock("jsonwebtoken");

// Mock morgan middleware
jest.mock("morgan", () => {
    return () => (req, res, next) => next();
});

describe("Authentication Middleware", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            cookies: {},
            headers: {
                host: "localhost:8000",
                connection: "keep-alive",
                "user-agent": "Jest Test Agent",
            },
            connection: {
                remoteAddress: "127.0.0.1",
            },
            method: "GET",
            url: "/test",
            originalUrl: "/test",
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn(),
        };
        next = jest.fn();
    });

    describe("isAuthenticated", () => {
        it("should call next with error if no token is present", async () => {
            await isAuthenticated(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0]).toBeInstanceOf(ErrorHandler);
            expect(next.mock.calls[0][0].message).toBe(
                "Please login to continue"
            );
        });

        it("should set req.user and call next if token is valid", async () => {
            req.cookies.token = "valid-token";
            const mockUser = { _id: "user-id", name: "Test User" };

            jwt.verify.mockReturnValue({ id: "user-id" });
            User.findById.mockResolvedValue(mockUser);

            await isAuthenticated(req, res, next);

            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalledWith();
        });
    });

    describe("isSeller", () => {
        it("should verify seller authentication", async () => {
            req.cookies.seller_token = "valid-token";
            const mockSeller = { _id: "seller-id", name: "Test Shop" };

            jwt.verify.mockReturnValue({ id: "seller-id" });
            Shop.findById.mockResolvedValue(mockSeller);

            await isSeller(req, res, next);

            expect(req.seller).toEqual(mockSeller);
            expect(next).toHaveBeenCalledWith();
        });
    });

    describe("isAdmin", () => {
        it("should verify admin role", () => {
            req.user = { role: "Admin" };
            const adminMiddleware = isAdmin("Admin");

            adminMiddleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        it("should reject non-admin users", () => {
            req.user = { role: "User" };
            const adminMiddleware = isAdmin("Admin");

            adminMiddleware(req, res, next);

            // Updated to match the actual message in your code
            expect(next.mock.calls[0][0].message).toBe("User can not access this resource!");
        });
    });
});
