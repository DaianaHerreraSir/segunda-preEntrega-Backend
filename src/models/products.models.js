import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";



const { Schema } = mongoose;



const productsCollection = "products";

const productsSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  status: Boolean,
  category: String,
});


productsSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productsCollection, productsSchema);

export default productModel;


