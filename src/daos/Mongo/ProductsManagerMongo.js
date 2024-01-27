import productModel from "../../models/products.models.js";

class ProductsManagerMongo {

async getProducts(){
    try {
      const products = await productModel.find();
      return products;
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      throw error;
    }
  }

async getProduct() {
    try {

      const products = await productModel.find({});

      console.log('Productos recuperados:', products);

      return products;

    } catch (error) {
      console.error('Error en getProducts:', error);
      throw error;
    }
  }

async createProduct(productNew) {
    try {
    
      const createdProduct = await productModel.create(productNew);

      const fullProduct = await productModel.findById(createdProduct._id);

      return fullProduct;

    } catch (error) {
      console.error('Error en createProduct:', error);
      throw error;
    }
  }


  async updateProduct(pid, updatedData) {
    try {
      
      return await productModel.findByIdAndUpdate(pid, updatedData, { new: true });

    } 
    catch (error) {
      console.error('Error en updateProduct:', error);
      throw error;
    }
  }

async deleteProduct(pid) {
    try {
      
      return await productModel.findByIdAndDelete(pid);

    } 
    catch (error) {
      console.error('Error en deleteProduct:', error);
      throw error;
    }
  }
}

export default ProductsManagerMongo;
