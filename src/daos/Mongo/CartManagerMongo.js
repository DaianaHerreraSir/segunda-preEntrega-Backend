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

async getCart(cartId) {
    try {
      const cart = await cartModel.findById(cartId).lean().populate('products.product');
      return cart;
    } catch (error) {
      console.error('Error en getCart:', error);
      throw error;
    }
  }

async getCartProducts(cartId) {
    try {
        const cart = await cartModel.findById(cartId).lean();
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

  async addProductToCart(cartId, productId, title, description, price, quantity = 1, res) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(
        cartId,
        {
          $addToSet: {
            products: {
              product: productId,
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
  

async deleteCart(cartId) {
    try {
    
      const deletedCart = await cartModel.findByIdAndDelete(cartId);

      if (!deletedCart) {
        throw new Error('Carrito no encontrado');
      }

      return deletedCart;
    } catch (error) {
      console.error('Error en deleteCart:', error);
      throw error;
    }
  }


  async removeProductFromCart(cartId, productId, res) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const index = cart.products.findIndex(productEntry => productEntry.product && productEntry.product.equals(productId));

      if (index !== -1) {
        cart.products.splice(index, 1);
        await cart.save();
        const updatedCart = await cartModel.findById(cartId).populate('products.product');
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

  async updateCartProducts(cartId, products, res) {
    try {
      const cart = await cartModel.findById(cartId);
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      for (const product of products) {
        const { productId, title, description, price, quantity } = product;
        const existingProduct = await productModel.findById(productId);
  
        if (existingProduct) {
          const productEntry = {
            product: existingProduct._id,
            title,
            description,
            price,
            quantity
          };
  
          const existingEntryIndex = cart.products.findIndex(entry => entry.product.equals(existingProduct._id));
  
          if (existingEntryIndex !== -1) {
          
            cart.products[existingEntryIndex].quantity += quantity;
          } else {
          
            cart.products.push(productEntry);
          }
        } else {
          console.warn(`Producto con ID ${productId} no encontrado`);
        }
      }
  
      await cart.save();
      const updatedCart = await cartModel.findById(cartId).populate('products.product');
  
      if (res) {
        res.json(updatedCart);
      }
  
      return updatedCart;
    } catch (error) {
      console.error('Error en updateCartProducts:', error);
      throw error;
    }
  }
  

  async updateProductQuantity(cartId, productId, quantity, res) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const existingProduct = cart.products.find(productEntry => productEntry.product && productEntry.product.equals(productId));

      if (existingProduct) {
        existingProduct.quantity = quantity;
        await cart.save();
        const updatedCart = await cartModel.findById(cartId).populate('products.product');
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

  async clearCart(cartId, res) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = [];
      await cart.save();
      const updatedCart = await cartModel.findById(cartId).populate('products.product');

      if (res) {
        res.json(updatedCart);
      }

      return updatedCart;
    } catch (error) {
      console.error('Error en clearCart:', error);
      throw error;
    }
  }

}


export default CartManagerMongo;