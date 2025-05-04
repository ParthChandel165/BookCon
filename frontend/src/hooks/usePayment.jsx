import { useNavigate } from 'react-router-dom';
import { useRazorpay } from "react-razorpay";
import axios from 'axios';
import { server } from "../server";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
const useCreateRoom = () => {
    console.log(import.meta.env);
    const {user }= useSelector((state) => state.user);
    const { error, isLoading, Razorpay } = useRazorpay();
    const navigate = useNavigate();
    const roomHandler = async () => {
        const orderData = JSON.parse(localStorage.getItem("latestOrder"));
        try {
            const response = await axios.post('https://bookcon-backend.onrender.com/api/v2/payment/create-payment', {
                amount: orderData.totalPrice
            }, {
                withCredentials: true,

            });
            const order = response.data;
            if (response.status === 200) {
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                    currency: 'INR',
                    name: 'Book Con',
                    description: 'create your payment',
                    order_id: order.id,
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: "+919500043423"
                    },
                    theme: {
                        color: '#F37254'
                    },
                    handler: async function () {
                        const config = {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        };
                        const orderRes = {
                            cart: orderData?.cart,
                            shippingAddress: orderData?.shippingAddress,
                            user: user && user,
                            totalPrice: orderData?.totalPrice,
                        };
                        orderRes.paymentInfo = {
                            id: order.id,
                            status: "Success",
                            type: "Credit Card",
                        };
    
                        await axios
                            .post(`${server}/order/create-order`, orderRes, config)
                            .then((res) => {
                                navigate("/order/success");
                                toast.success("Order successful!");
                                localStorage.setItem("cartItems", JSON.stringify([]));
                                localStorage.setItem("latestOrder", JSON.stringify([]));
                            }).catch((error) => {
                                console.log(error);
                                toast.error("Order failed!");
                            });

                    }
                };
                if (error) throw Error(error.message);
                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();

            }

        } catch (error) {
            console.log(error);
            alert('Payment verification failed');
            
        }

    }
    return roomHandler;
}

export { useCreateRoom }