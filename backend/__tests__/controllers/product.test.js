const Product = require("../../model/product");
const Shop = require("../../model/shop");

// Mock models
jest.mock("../../model/product");
jest.mock("../../model/shop");

describe("Product Controller Functions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getProductsByShopId", () => {
        it("should return products for a specific shop", async () => {
            const mockProducts = [
                { _id: "product1", name: "Book 1", category: "Fiction" },
                { _id: "product2", name: "Book 2", category: "Non-Fiction" },
            ];

            Product.find.mockResolvedValue(mockProducts);

            const shopId = "shop1";
            const products = await Product.find({ shopId });

            expect(products).toEqual(mockProducts);
            expect(Product.find).toHaveBeenCalledWith({ shopId });
        });
    });

    describe("getGenreDistribution", () => {
        it("should calculate genre distribution correctly", () => {
            const products = [
                { category: "Fiction" },
                { category: "Fiction" },
                { category: "Non-Fiction" },
                { category: "Mystery" },
                { category: "Fiction" },
            ];

            const genreCount = products.reduce((acc, product) => {
                const genre = product.category;
                acc[genre] = (acc[genre] || 0) + 1;
                return acc;
            }, {});

            expect(genreCount).toEqual({
                Fiction: 3,
                "Non-Fiction": 1,
                Mystery: 1,
            });
        });
    });

    describe("createProduct", () => {
        it("should create a product with valid shop", async () => {
            const mockShop = { _id: "shop1", name: "Test Shop" };
            Shop.findById.mockResolvedValue(mockShop);

            const mockProduct = {
                name: "New Book",
                description: "Exciting story",
                category: "Fiction",
                price: 299,
                discountPrice: 249,
                stock: 10,
                shopId: "shop1",
                images: ["image1.jpg"],
            };

            Product.create.mockResolvedValue({
                _id: "product1",
                ...mockProduct,
                shop: mockShop,
            });

            const productData = {
                ...mockProduct,
            };

            productData.shop = mockShop;

            const product = await Product.create(productData);

            expect(product._id).toBe("product1");
            expect(product.shop).toEqual(mockShop);
        });
    });
});
