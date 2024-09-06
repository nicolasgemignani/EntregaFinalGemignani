import mongoose from "mongoose";

const collectionName = 'carts'

const cartSchema = mongoose.Schema({
    products:{
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        default: []
    }
})

cartSchema.pre(/^find/, function(){
    this.populate('products.product')
})

const cartModel = mongoose.model(collectionName, cartSchema)

export default cartModel