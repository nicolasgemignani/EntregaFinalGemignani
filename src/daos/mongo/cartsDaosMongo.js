import mongoose from 'mongoose'
import cartModel from '../../models/cartsModel.js'
import productModel from '../../models/productsModel.js'

class CartDaosMongo {
    constructor(){
        this.model = cartModel
    }

    createCart = async () => {
        try {
            const newCart = new this.model({ products: [] })

            await newCart.save()

            return newCart
        } catch (error) {
            console.log(error);
        }
    }

    getCartById = async (cartId) => {
        try {
            const cart = await this.model.findById(cartId)
            if (!cart) {
                console.log('Error');
            }
            return cart
        } catch (error) {
            console.log(error);
        }
    }

    addProductToCart = async (cartId, productId, quantityToAdd = 1) => {
        try {
            const cart = await this.model.findById(cartId)
            if (!cart) {
                console.log('CartError');
            }

            const product = await productModel.findById(productId)
            if (!product) {
                console.log('ProductError');
            }

            const existingProduct = cart.products.find(p => p.product.toString() === productId.toString())

            if (existingProduct) {
                existingProduct.quantity += quantityToAdd
            } else {
                cart.products.push({ product: productId, quantity: quantityToAdd})
            }

            await cart.save()
            return cart
        } catch (error) {
            console.log(error);
        }
    }

    updateCartProducts = async (cartId, newProducts) => {
        try {
            // Buscar el carrito por ID
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            // Verificar si todos los productos en el nuevo arreglo existen
            const productIds = newProducts.map(p => p.product);
            const existingProducts = await productModel.find({ _id: { $in: productIds } });
            const existingProductIds = new Set(existingProducts.map(p => p._id.toString()));
    
            if (productIds.some(id => !existingProductIds.has(id))) {
                throw new Error('Uno o más productos no existen en la colección');
            }
    
            // Crear un objeto de los productos nuevos para actualizarlos más fácilmente
            const newProductsMap = newProducts.reduce((acc, { product, quantity }) => {
                acc[product.toString()] = quantity;
                return acc;
            }, {});
    
            // Actualizar o agregar productos
            const updatedProducts = [];
            const productsToRemove = new Set(cart.products.map(p => p.product.toString()));
    
            for (const { product, quantity } of newProducts) {
                const productId = product.toString();
                if (cart.products.some(p => p.product.toString() === productId)) {
                    // Actualizar cantidad del producto existente
                    updatedProducts.push({ product, quantity });
                    productsToRemove.delete(productId);
                } else {
                    // Agregar nuevo producto
                    updatedProducts.push({ product, quantity });
                }
            }
    
            // Eliminar productos que ya no están en el arreglo
            cart.products = updatedProducts;
            cart.products = cart.products.filter(p => !productsToRemove.has(p.product.toString()));
    
            // Guardar el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error actualizando el carrito:', error);
            throw new Error('No se pudo actualizar el carrito');
        }
    }

    updateProductQuantity = async (cartId, productId, newQuantity) => {
        try {
            // Buscar el carrito por ID
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            // Buscar el producto dentro del carrito
            const product = cart.products.find(p => p.product.toString() === productId.toString());
            if (!product) {
                throw new Error('Producto no encontrado en el carrito');
            }
    
            // Actualizar la cantidad del producto
            product.quantity = newQuantity;
    
            // Guardar el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error actualizando la cantidad del producto:', error);
            throw new Error('No se pudo actualizar la cantidad del producto');
        }
    }
    

    removeProductFromCart = async (cartId, productId) => {
        try {
            const cart = await this.model.findById(cartId)
            if (!cart) {
                console.log('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId.toString())
            if (productIndex === -1) {
                console.log('Producto no encontrado');
            }

            cart.products.splice(productIndex, 1)

            await cart.save()
            return cart
        } catch (error) {
            console.log(error);
        }
    }
    
    emptyCart = async (cartId) => {
        try {
            // Buscar el carrito por ID
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            // Vaciar el arreglo de productos
            cart.products = [];
    
            // Guardar el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw new Error('No se pudo vaciar el carrito');
        }
    };
    
}

export default CartDaosMongo