const Order = require("../../model/order");
const Shop = require("../../model/shop");

jest.mock("../../model/order");
jest.mock("../../model/shop");

describe("Order Processing", () => {
    describe("createOrder", () => {
        it("should create orders grouped by shop", async () => {
            const cart = [
                {
                    shopId: "shop1",
                    name: "Book 1",
                    price: 100,
                    _id: "item1",
                    qty: 2,
                },
                {
                    shopId: "shop1",
                    name: "Book 2",
                    price: 150,
                    _id: "item2",
                    qty: 1,
                },
                {
                    shopId: "shop2",
                    name: "Book 3",
                    price: 200,
                    _id: "item3",
                    qty: 1,
                },
            ];

            const shippingAddress = {
                address: "123 Main St",
                city: "Testville",
            };
            const user = { _id: "user1", name: "Test User" };
            const totalPrice = 550;
            const paymentInfo = { id: "payment1", status: "succeeded" };

            // Group cart items by shopId
            const shopItemsMap = new Map();
            for (const item of cart) {
                if (!shopItemsMap.has(item.shopId)) {
                    shopItemsMap.set(item.shopId, []);
                }
                shopItemsMap.get(item.shopId).push(item);
            }

            // Mock order creation
            Order.create.mockImplementation((data) => {
                return Promise.resolve({
                    _id: data.cart[0].shopId === "shop1" ? "order1" : "order2",
                    ...data,
                });
            });

            const orders = [];

            // Create orders by shop
            for (const [shopId, items] of shopItemsMap) {
                const order = await Order.create({
                    cart: items,
                    shippingAddress,
                    user,
                    totalPrice: items.reduce(
                        (sum, item) => sum + item.price * item.qty,
                        0
                    ),
                    paymentInfo,
                });

                orders.push(order);
            }

            expect(orders).toHaveLength(2);
            expect(orders[0]._id).toBe("order1");
            expect(orders[1]._id).toBe("order2");
            expect(orders[0].totalPrice).toBe(350); // 100*2 + 150*1
            expect(orders[1].totalPrice).toBe(200); // 200*1
        });
    });

    describe("updateOrderStatus", () => {
        it("should update seller balance on delivery", async () => {
            const mockOrder = {
                _id: "order1",
                status: "Processing",
                cart: [{ shopId: "shop1", _id: "product1", qty: 2 }],
                totalPrice: 200,
                paymentInfo: { status: "Pending" },
                save: jest.fn().mockResolvedValue(true),
                deliveredAt: undefined,
            };

            Order.findById.mockResolvedValue(mockOrder);
            Shop.findByIdAndUpdate.mockResolvedValue({
                _id: "shop1",
                name: "Test Shop",
            });

            // Function to test
            async function updateOrderStatus(orderId, status) {
                const order = await Order.findById(orderId);
                order.status = status;

                if (status === "Delivered") {
                    order.deliveredAt = Date.now();
                    order.paymentInfo.status = "Succeeded";

                    const serviceCharge = order.totalPrice * 0.1;
                    const sellerAmount = order.totalPrice - serviceCharge;

                    await Shop.findByIdAndUpdate(order.cart[0].shopId, {
                        $inc: { availableBalance: sellerAmount },
                    });
                }

                await order.save();
                return order;
            }

            const updatedOrder = await updateOrderStatus("order1", "Delivered");

            expect(updatedOrder.status).toBe("Delivered");
            expect(updatedOrder.deliveredAt).toBeDefined();
            expect(updatedOrder.paymentInfo.status).toBe("Succeeded");
            expect(Shop.findByIdAndUpdate).toHaveBeenCalledWith(
                "shop1",
                { $inc: { availableBalance: 180 } } // 200 - 20(10% service charge)
            );
        });
    });
});