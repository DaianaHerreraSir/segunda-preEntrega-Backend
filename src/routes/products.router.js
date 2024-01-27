import { Router } from "express";
import ProductsManagerMongo from "../daos/Mongo/productsManagerMongo.js";


const productsRouter = Router();

const productManager = new ProductsManagerMongo()


productsRouter.get("/", async (req, res) => {
  
  try {
    
    const products = await productManager.getProducts();
    res.json(products);
  } 
  catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
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



