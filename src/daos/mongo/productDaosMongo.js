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
            console.log(error);
        }
    }
    /* getProduct      = async opts => await this.model.findOne(opts)
    createProducts  = async newProduct => await this.model.create(newProduct)
    deleteProducts  = async opts => await this.model.deleteOne(opts)
    updateProducts  = async opts => await this.model.updateOne(opts) */
}

export default ProductDaosMongo