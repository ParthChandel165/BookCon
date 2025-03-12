"use client"

import React, { useEffect } from "react"
import ShopCreate from "../components/Shop/ShopCreate"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const ShopCreatePage = () => {
  const navigate = useNavigate()
  const { isSeller, seller } = useSelector((state) => state.seller)

  // If seller is already authenticated, redirect to shop dashboard
  useEffect(() => {
    if (isSeller === true) {
      navigate(`/shop/${seller._id}`)
    }
  }, [isSeller, seller, navigate])

  return (
    <div>
      <ShopCreate />
    </div>
  )
}

export default ShopCreatePage
