import mongoose from "mongoose";
import productModel from "./products.models.js";


const { Schema } = mongoose;

const cartsCollection = "carts";



const cartsSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: Number,
    stock: Number,
    status: Boolean,
    category: String,
    products: [{
        product: { type: Schema.Types.ObjectId, ref: productModel },
        quantity: { type: Number, default: 0 }
    }]
});

cartsSchema.pre("findById",function(){
    this.populate(productModel.product)
})
const cartModel = mongoose.model(cartsCollection,cartsSchema);

export default cartModel;
