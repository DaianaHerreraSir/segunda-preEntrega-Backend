import { Router } from "express";
import ProductsManagerMongo from "../daos/Mongo/productsManagerMongo.js";
import productModel from "../models/products.models.js";


const productsRouter = Router();

const productManager = new ProductsManagerMongo()


productsRouter.get("/", async (req, res) => {

try {
  
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || 'none';
  const query = req.query.query || '';


  const options = {
    page,
    limit,
    sort: sort === 'none' ? {} : { price: sort === 'asc' ? 1 : -1 },
  };

  
  const filter = query ? { title: new RegExp(query, 'i') } : {};

  
  const result = await productModel.paginate(filter, options);

  res.json({
    total: result.totalDocs,
    limit: result.limit,
    page: result.page,
    sort,
    query,
    products: result.docs,
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
})



productsRouter.get("/:pid", async (req, res) => {
  
  const { pid } = req.params;
  
  try {
    const product = await productManager.getProduct(pid);
    res.send(product);
  } 
  catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
});


productsRouter.post("/", async (req, res) => {
  
  const { title, description, price, thumbnail, code, stock, status = true, category } = req.body[0];
  
  const productNew = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  };

  try {
    const createdProduct = await productManager.createProduct(productNew);
    res.send({ success: true, message: 'Producto creado exitosamente', product: createdProduct });
  } 
  catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
});


productsRouter.put("/:pid", async (req, res) => {
  
  const { pid } = req.params;
  
  const productToUpdate = req.body;
  
  try {
    const result = await productManager.updateProduct(pid, productToUpdate);
    res.send(result);
  } 
  catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  
  const { pid } = req.params;
  
  try {
    const result = await productManager.deleteProduct(pid);
    res.send(result);
  } 
  catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
});

export default productsRouter;

