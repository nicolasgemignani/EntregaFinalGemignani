import express from 'express'
import mongoose from 'mongoose'
import CartDaosMongo from '../../daos/mongo/cartsDaosMongo.js'
import ProductDaosMongo from '../../daos/mongo/productDaosMongo.js'
import productModel from '../../models/productsModel.js'

const cartService = new CartDaosMongo()
const productService = new ProductDaosMongo()

const router = express.Router()

router.get('/products', async (req, res) => {
    let page = req.query.page || 1
    let limit = 2
    try {
        const listadoProducts = await productModel.paginate({}, {limit, page})

        const productsResultadoFinal = listadoProducts.docs.map( product => {
            const {_id, ...rest} = product.toObject()
            return {_id, ...rest}
        })

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
        res.status(500).send('Error')
    }
})

router.post('/cart/add/:productId', async (req, res) => {
    const { productId } = req.params;
    let { quantity } = req.body; // Puedes ajustar esto según tu lógica

    try {

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'ID del producto no válido' });
        }

        quantity = parseInt(quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'Cantidad no válida' });
        }

        const cartId = req.session.cartId; // Asume que tienes el ID del carrito en la sesión

        if (!cartId) {
            // Crear un nuevo carrito si no existe
            const newCart = await cartService.createCart();
            req.session.cartId = newCart._id;
            return res.status(201).json(newCart);
        }
        
        const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
        res.json({
            cart: updatedCart,
            message: 'Producto agregado al carrito'
            // Otros detalles si es necesario
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
    }
});

export default router