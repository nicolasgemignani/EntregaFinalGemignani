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

    // Agrega un Producto al carrito, con quantity podes aumentar la cantidad de los que queres agregar
    addProductToCart = async (cartId, productId, quantityToAdd = 1) => {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
    
            const existingProduct = cart.products.find(p => p.product.toString() === productId.toString());
    
            if (existingProduct) {
                existingProduct.quantity += quantityToAdd;
            } else {
                cart.products.push({ product: productId, quantity: quantityToAdd });
            }
            
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error agregando el producto al carrito:', error);
            throw new Error('No se pudo agregar el producto al carrito');
        }
    }

    updateCartProducts = async (cartId, newProducts) => {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            const productIds = newProducts.map(p => p.product);
            const existingProducts = await productModel.find({ _id: { $in: productIds } });
            const existingProductIds = new Set(existingProducts.map(p => p._id.toString()));
    
            if (productIds.some(id => !existingProductIds.has(id))) {
                throw new Error('Uno o más productos no existen en la colección');
            }
    
            const newProductsMap = newProducts.reduce((acc, { product, quantity }) => {
                acc[product.toString()] = quantity;
                return acc;
            }, {});
    
            cart.products = cart.products.map(p => {
                if (newProductsMap[p.product.toString()] !== undefined) {
                    return { product: p.product, quantity: newProductsMap[p.product.toString()] };
                }
                return p;
            });
    
            newProducts.forEach(({ product, quantity }) => {
                if (!cart.products.some(p => p.product.toString() === product.toString())) {
                    cart.products.push({ product, quantity });
                }
            });
    
            cart.products = cart.products.filter(p => newProductsMap[p.product.toString()] !== undefined);
    
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
            const product = cart.products.find(p => p.product._id.toString() === productId.toString());
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
    
    deleteCart = async (cartId) => {
        try {
            const result = await this.model.deleteOne({ _id: cartId });

            if (result.deletedCount === 0) {
                throw new Error('Carrito no encontrado');
            }

            return { message: 'Carrito eliminado correctamente' };
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            throw new Error('No se pudo eliminar el carrito');
        }
    };
}

export default CartDaosMongo