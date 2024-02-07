import mongoose from "mongoose";



const cartsCollection = "cart";


const { Schema } = mongoose;

const cartsSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: Number
    }]
});


cartsSchema.pre('findById', function () {
    this.populate('products.product');
});
const cartModel = mongoose.model(cartsCollection,cartsSchema);

export default cartModel;
