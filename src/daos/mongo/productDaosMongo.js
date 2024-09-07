import productModel  from "../../models/productsModel.js";

class ProductDaosMongo {
    constructor(){
        this.model = productModel
    }

    getProducts = async ({ limit = 10, page = 1, sort = { price: 1 }, query = {} }) => {
        try {
            const options = {
                limit,
                page,
                sort,
                lean: true
            }
            const result = await productModel.paginate(query, options)
            return result
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Error fetching products');
        }
    }

    getProductById = async (productId) => {
        try {
            const product = await this.model.findById(productId).lean();
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            return product;
        } catch (error) {
            console.error(`Error fetching product by ID: ${productId}`, error);
            throw new Error('Error fetching product by ID');
        }
    };
    
    createProduct = async (productData) => {
        try {
            const newProduct = await this.model.create(productData);
            return newProduct;
        } catch (error) {
            console.error('Error creating product:', error);
            throw new Error('Error creating product');
        }
    };
    
    updateProduct = async (productId, updateData) => {
        try {
            const updatedProduct = await this.model.findByIdAndUpdate(productId, updateData, { new: true, lean: true });
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            throw new Error('Error updating product');
        }
    };
    
    deleteProduct = async (productId) => {
        try {
            const deletedProduct = await this.model.findByIdAndDelete(productId);
            return deletedProduct;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new Error('Error deleting product');
        }
    };
    
}

export default ProductDaosMongo

/* getProductId      = async opts => await this.model.findOne(opts)
    createProducts  = async newProduct => await this.model.create(newProduct)
    deleteProducts  = async opts => await this.model.deleteOne(opts)
    updateProducts  = async opts => await this.model.updateOne(opts) */