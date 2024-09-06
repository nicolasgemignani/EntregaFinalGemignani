import express from 'express'
import productRouter from './api/productRouter.js'
import cartRouter from './api/cartRouter.js'
import viewRouter from "./api/viewsRouter.js"
import multer from '../utils/multer.js'

const router = express.Router()

router.post('/', multer.single('myFile'), (req, res) => {
    res.send('Archivo subido')
})


router.use('/', viewRouter)
router.use('/api/products', productRouter)
router.use('/api/carts', cartRouter)

export default router