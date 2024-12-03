import React from 'react'
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";


const Hero = () => {
    return (
        <div
            className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
            style={{
                backgroundImage:
                    "url(https://www.microsoft.com/en-us/research/uploads/prod/2023/04/msr-publications-page-header.jpg)",
            }}
        >
            <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
                <h1
                    className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#FFFFFF] font-[600] capitalize`}
                >
                    Best Website for <br /> Trading Books
                </h1>
                <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#999999]">
                Welcome to BookCon, the ultimate platform for book enthusiasts! Connect with fellow readers<br /> buy and sell pre-loved books, and give every story a chance to be rediscovered.{" "}
                    <br />Discover, connect, and trade with ease. Empowering readers to buy, sell, and share their favorite books.<br /> Join a thriving community where every story finds a new home.
                </p>
                <Link to="/products" className="inline-block">
                    <div className={`${styles.button} mt-5`}>
                        <span className="text-[#fff] font-[Poppins] text-[18px]">
                            Shop Now
                        </span>
                    </div>
                </Link>

            </div>

        </div>
    )
}

export default Hero