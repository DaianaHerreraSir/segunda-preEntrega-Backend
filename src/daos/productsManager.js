import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';


export class ProductManager {
    constructor() {
      this.path = "products.json";
      this.products=[];
    }
  
addProduct = async ({title, description, price, thumbnail,code,stock,status,category})=>{
if(!title || !price ){
  return"El título y el precio son obligatorios"
}
    const id= uuidv4()
    

    let newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    };
try{
    this.products= await this.getProducts()
    this.products.push(newProduct)
  
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2, 'utf-8'))

    return newProduct
  
}catch (error) {
  console.error('Error en addProduct:', error);
  throw error; // Puedes decidir lanzar el error nuevamente o manejarlo de otra manera
}}
  getProducts = async ()=>{
    const response= await fs.readFile(this.path, "utf-8")
    const responseJSON= JSON.parse(response)

    return responseJSON
  }
 

  getProductsById= async (id)=>{
    const response= await this.getProducts()

    const product = response.find(product => product.id === id)
  
  if(product){
    return product
  }else{
    console.log("no se encontrado el producto");
  }
}
updateProduct = async (id, {...data})=>{
  
  const  products = this.getProducts()

  const index= response.findIndex(product => product.id === id)

  if(index !== 1){

    products[index] = {id, ...data}
    await fs.writeFile(this.path, JSON.stringify(response, null, 2))

    return products[index]
  } else {

    console.log("no se encontro el producto");
  }

}
deleteProduct= async (id)=>{

  const products= await this.getProducts()

  const index = products.findIndex(product => product.id === id)

  if(index !== - 1){
     products.splice(index,1)
      await fs.writeFile(this.path, JSON.stringify(products))
      return "producto eliminado"
  } else{

    console.log("no se encontro el producto");
    return "producto no encontrado"
  }

}


}