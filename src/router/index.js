// Importa el modulo express para crear el enrutador y los modulos de los enrutadores de API
import express from 'express'
import productRouter from './api/productRouter.js'
import cartRouter from './api/cartRouter.js'
import viewRouter from "./api/viewsRouter.js"

// Crea una nueva instancia del enrutador de express
const router = express.Router()

// Configura el enrutador principal para menjar las rutas
// Redirige todas las solicitudes a la raiz ('/') al enrutador de vistas
router.use('/', viewRouter)

// Redirige las solicitudes a '/api/products' al enrutador de productos
router.use('/api/products', productRouter)

// Redirige las solicutdes a '/api/carts' al enrutador de carritos
router.use('/api/carts', cartRouter)

// Exporta el enrutador para que pueda ser usado en otros modulos
export default router