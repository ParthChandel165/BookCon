"use client"

import { useEffect } from "react"
import ShopLogin from "../components/Shop/ShopLogin"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const ShopLoginPage = () => {
  const navigate = useNavigate()
  const { isSeller, isLoading } = useSelector((state) => state.seller)

  // if user is login then redirect to dashboard
  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`)
    }
  }, [isLoading, isSeller, navigate])

  return <ShopLogin />
}

export default ShopLoginPage

