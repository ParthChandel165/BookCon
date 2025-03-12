"use client"

import { useEffect } from "react"
import Signup from '../components/Signup/Signup'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const SignupPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.user)

  // if user is login then redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  return <Signup />
}

export default SignupPage

