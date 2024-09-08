import express from 'express'
import mongoose from 'mongoose'
import CartDaosMongo from '../../daos/mongo/cartsDaosMongo.js'
import ProductDaosMongo from '../../daos/mongo/productDaosMongo.js'
import productModel from '../../models/productsModel.js'

const cartService = new CartDaosMongo()
const productService = new ProductDaosMongo()

const router = express.Router()

// Ruta para obtener productos con paginacion
router.get('/products', async (req, res) => {
    // Obtener el numero de pagina con un valor predeterminado de 1
    let page = req.query.page || 1
    let limit = 2 // Limite de productos por pagina
    try {
        // Obten los productos desde la base de datos con paginacion
        const listadoProducts = await productModel.paginate({}, {limit, page})

        // Mapea los productos para excluir el campo _id en la vista
        const productsResultadoFinal = listadoProducts.docs.map( product => {
            const {_id, ...rest} = product.toObject()
            return {_id, ...rest}
        })

        // Renderiza la vista con los productos y la informacion de paginacion
        res.render('products', {
            products: productsResultadoFinal,
            hasPrevPage: listadoProducts.hasPrevPage,
            hasNextPage: listadoProducts.hasNextPage,
            prevPage: listadoProducts.prevPage,
            nextPage: listadoProducts.nextPage,
            currentPage: listadoProducts.page,
            totalPages: listadoProducts.totalPages
        })

    } catch (error) {
        console.error('Error fetching products:', error)
        res.status(500).send('Error fetching products')
    }
})

// Ruta para agregar productos al carrito
router.post('/cart/add/:productId', async (req, res) => {
    const { productId } = req.params
    let { quantity } = req.body // La cantidad de producto a agregar

    try {
        // Validar que le ID del producto sea un ID de MongoDb valida
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'ID del producto no válido' })
        }

        // Convertir la cantidad a un numero entero y validar que sea positiva
        quantity = parseInt(quantity, 10)
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'Cantidad no válida' })
        }

        const cartId = req.session.cartId; // Obten el ID del carrito desde la sesion

        if (!cartId) {
            // Crear un nuevo carrito si no existe y guarda el ID en la sesion
            const newCart = await cartService.createCart()
            req.session.cartId = newCart._id
            return res.status(201).json(newCart)
        }
        
        // Agregar el producto al carrito existente
        const updatedCart = await cartService.addProductToCart(cartId, productId, quantity)
        res.json({
            cart: updatedCart,
            message: 'Producto agregado al carrito'
        })

    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
    }
})

export default router