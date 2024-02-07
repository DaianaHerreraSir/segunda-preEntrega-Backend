import productModel from "../../models/products.models.js";
import cartModel from "../../models/carts.models.js";




class CartManagerMongo {

async createCart() {
    try {
      const newCart = await cartModel.create({ products: [] });
      console.log('Nuevo carrito creado:', newCart);
      return newCart;
    } catch (error) {
      console.error('Error en createCart:', error);
      throw error;
    }
  }

async getCart(cid) {
  try {
      const cart = await cartModel.findById(cid).populate('products.product');
      console.log(cart);
      
      const leanCart = cart.toObject();
      return leanCart;
  } catch (error) {
      console.error('Error en getCart:', error);
      throw error;
  }
}

async getCartProducts(cid) {
    try {
        const cart = await cartModel.findById(cid).populate('products.product');
        if (cart) {
            return cart.products
        } else {
            console.log("Carrito no encontrado");
            return [];
        }
    } catch (error) {
        console.error('Error en getCartProducts:', error);
        throw error;
    }
}

async newCart() {
    try {
      const newCart = { products: [] };
      await cartModel.create(newCart);
      return newCart;
    } catch (error) {
      console.error('Error en newCart:', error);
      throw error;
    }
  }

  async addProductToCart(cid, pid, title, description, price, quantity = 1, res) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(
        cid,
        {
          $addToSet: {
            products: {
              product: pid,
              title,
              description,
              price,
              quantity
            }
          }
        },
        { new: true } 
      ).populate('products.product');
  
      if (!updatedCart) {
        throw new Error('Carrito no encontrado');
      }
  
      if (res) {
        res.json(updatedCart);
      }
  
      return updatedCart;
    } catch (error) {
      console.error('Error en addProductToCart:', error);
      throw error;
    }
  }
  
  async updateCartProducts(cid, products, res) {
    try {
      const cart = await cartModel.findById(cid);
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      for (const product of products) {
        const { pid, title, description, price, quantity } = product;
  
        const existingEntryIndex = cart.products.findIndex(entry => entry.product.equals(pid));
  
        if (existingEntryIndex !== -1) {
          console.log('Existing product found. Updating quantity...');
          // Si ya existe, actualiza la cantidad del producto existente
          cart.products[existingEntryIndex].quantity += quantity;
        } else {
          console.log('New product. Adding to cart...');
          // Si no existe, agrega un nuevo producto al carrito
          const existingProduct = await productModel.findById(pid);
  
          if (existingProduct) {
            cart.products.push({
              product: existingProduct._id,
              title,
              description,
              price,
              quantity
            });
          } else {
            console.warn(`Producto con ID ${pid} no encontrado`);
          }
        }
      }
  
      await cart.save();
      const updatedCart = await cartModel.findById(cid).populate('products.product');
  
      if (res) {
        res.json(updatedCart);
      }
  
      return updatedCart;
    } catch (error) {
      console.error('Error en updateCartProducts:', error);
      throw error;
    }
  }
  
  async updateProductQuantity(cid, pid, quantity, res) {
    try {
      const cart = await cartModel.findById(cid);
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      const existingProduct = cart.products.find(productEntry => productEntry.product && productEntry.product.equals(pid));
  
      if (existingProduct) {
        existingProduct.quantity += quantity; // Utiliza += para sumar la cantidad
        await cart.save();
        const updatedCart = await cartModel.findById(cid).populate('products.product');
        if (res) {
          res.json(updatedCart);
        }
        return updatedCart;
      } else {
        throw new Error('Producto no encontrado en el carrito');
      }
    } catch (error) {
      console.error('Error en updateProductQuantity:', error);
      throw error;
    }
  }
  
async deleteCart(cid) {
    try {
    
      const deletedCart = await cartModel.findByIdAndDelete(cid);

      if (!deletedCart) {
        throw new Error('Carrito no encontrado');
      }

      return deletedCart;
    } catch (error) {
      console.error('Error en deleteCart:', error);
      throw error;
    }
  }


  async removeProductFromCart(cid, productId, res) {
    try {
      const cart = await cartModel.findById(cid);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const index = cart.products.findIndex(productEntry => productEntry.product && productEntry.product.equals(productId));

      if (index !== -1) {
        cart.products.splice(index, 1);
        await cart.save();
        const updatedCart = await cartModel.findById(cid).populate('products.product');
        if (res) {
          res.json(updatedCart);
        }
        return updatedCart;
      } else {
        throw new Error('Producto no encontrado en el carrito');
      }
    } catch (error) {
      console.error('Error en removeProductFromCart:', error);
      throw error;
    }
  }
}
export default CartManagerMongo;