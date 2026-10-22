import express from "express"
import { login, register, reVerify, verify } from "../Controllers/userController.js"

const router=express.Router()

router.post('/register',register)
router.post('/verify',verify)
router.post('/reVerify',reVerify)
router.post('/login',login)
// router.post('/logOut',logOut)

export default router