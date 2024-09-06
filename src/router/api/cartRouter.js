import express from 'express'
import CartDaosMongo from '../../daos/mongo/cartsDaosMongo.js'

const router = express.Router()
const cartService = new CartDaosMongo()


// createCart
router.post('/', async (req, res) => {
    try {
        // Llamar al método createCart para crear un nuevo carrito
        const newCart = await cartService.createCart();

        res.status(201).json({
            status: 'success',
            payload: newCart
        });
    } catch (error) {
        console.error('Error creando el carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo crear el carrito'
        });
    }
});

// getCardById
router.get('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;

        // Llamar al método getCartById para obtener el carrito
        const cart = await cartService.getCartById(cartId);

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        console.error('Error obteniendo el carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo obtener el carrito'
        });
    }
});

// addProductToCart
router.post('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantityToAdd = 1 } = req.body; // Obtener la cantidad desde el cuerpo de la solicitud (opcional)

        // Llamar al método addProductToCart para agregar el producto al carrito
        const updatedCart = await cartService.addProductToCart(cartId, productId, quantityToAdd);

        if (!updatedCart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito o producto no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Producto agregado al carrito exitosamente',
            payload: updatedCart
        });
    } catch (error) {
        console.error('Error agregando el producto al carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo agregar el producto al carrito'
        });
    }
});

// updateCartProducts
router.put('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const newProducts = req.body; // El cuerpo debe ser un arreglo de productos [{ product: 'productId', quantity: 1 }, ...]

        // Validar que newProducts sea un arreglo de objetos con los campos necesarios
        if (!Array.isArray(newProducts) || newProducts.some(p => !p.product || !p.quantity)) {
            return res.status(400).json({
                status: 'error',
                message: 'Formato de productos inválido. Debe ser un arreglo de objetos con los campos "product" y "quantity".'
            });
        }

        // Llamar al método updateCartProducts para actualizar los productos del carrito
        const updatedCart = await cartService.updateCartProducts(cartId, newProducts);

        res.status(200).json({
            status: 'success',
            message: 'Carrito actualizado exitosamente',
            payload: updatedCart
        });
    } catch (error) {
        console.error('Error actualizando los productos del carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo actualizar el carrito'
        });
    }
});

// updateProductQuantity
router.put('/:cartId/product/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// removeProductFromCArt
router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        // Llamar al método removeProductFromCart para eliminar el producto del carrito
        const updatedCart = await cartService.removeProductFromCart(cartId, productId);

        if (!updatedCart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito o producto no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado del carrito exitosamente',
            payload: updatedCart
        });
    } catch (error) {
        console.error('Error eliminando el producto del carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo eliminar el producto del carrito'
        });
    }
});


// emptyCart
router.delete('/', async (req, res) => {
    try {
        const { cartId } = req.params;
        
        // Llamar al método emptyCart para vaciar el carrito
        const updatedCart = await cartService.emptyCart(cartId);
        
        res.status(200).json({
            status: 'success',
            message: 'Carrito vaciado exitosamente',
            payload: updatedCart
        });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo vaciar el carrito'
        });
    }
})


export default router