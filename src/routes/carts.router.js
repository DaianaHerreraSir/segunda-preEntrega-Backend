
import { Router } from "express";
import CartManagerMongo from "../daos/Mongo/CartManagerMongo.js";

const cartsRouter = Router();
const cartManagerMongo = new CartManagerMongo();


  //creo un carrito
cartsRouter.post("/", async (req, res) => {
  
  try {

    const newCart = await cartManagerMongo.createCart();
    console.log('Nuevo carrito:', newCart);

    if (!newCart) {
      console.error('Error al crear el carrito. newCart es null o undefined.');
      res.status(500).send('Error al crear el carrito');
      return;
    }

  const cartId = newCart._id;

  const updatedCart = await cartManagerMongo.getCart(cartId);

  res.json(updatedCart);
  } 
  catch (error) {
    console.error("ERROR AL CREAR CARRITO", error);
    res.status(500).send("Error al crear carrito");
  }
});

//obtengo el carrito por su id
cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManagerMongo.getCart(cid);
    console.log(cart); // Agrega este console.log para verificar la estructura de cart
    res.render("carts", { cart });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).send("Error al obtener carrito");
  }
});


//agrego un producto por el id del producto

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { title, description, price, quantity } = req.body;

  try {
      console.log("pid:", pid);
      const updatedCart = await cartManagerMongo.addProductToCart(cid, pid, title, description, price, quantity);
      // res.json(updatedCart);
      res.send("Producto agregado al carrito")
  } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).send(`Error al agregar producto al carrito: ${error.message}`);
  }
});


//elimino el carrito por su id
cartsRouter.delete('/:cid', async (req, res) => {
    
  const { cid } = req.params;
  
  try {
      
    const deletedCart = await cartManagerMongo.deleteCart(cid);
  
    res.json({ message: 'Carrito eliminado exitosamente', deletedCart });
    } 
  catch (error) {
      console.error('Error al eliminar el carrito:', error);
      res.status(500).send('Error al eliminar el carrito');
    }
  });

// Eliminar un producto del carrito por el id
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const deletedCart = await cartManagerMongo.removeProductFromCart(cid, pid, res);
    res.json({ message: 'Producto eliminado exitosamente del carrito', deletedCart });

  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).send(`Error al eliminar producto del carrito: ${error.message}`);
  }
});

// Eliminar todos los productos del carrito
cartsRouter.delete('/api/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    await cartManagerMongo.clearCart(cid, res);
  } catch (error) {
    console.error('Error al eliminar todos los productos del carrito:', error);
    res.status(500).send('Error al eliminar todos los productos del carrito');
  }
});

// Actualizar carrito con un arreglo de productos
cartsRouter.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = req.body;

  try {
    await cartManagerMongo.updateCartProducts(cid, products, res);
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).send(`Error al actualizar el carrito: ${error.message}`);
  }
});

// Actualizar cantidad de un producto en el carrito
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    await cartManagerMongo.updateProductQuantity(cid, pid, quantity, res);
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto en el carrito:", error);
    res.status(500).send(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
  }
});



// carrito con productos completos
cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManagerMongo.getPopulatedCart(cid);
    res.json(cart);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).send("Error al obtener carrito");
  }
});



export default cartsRouter;





