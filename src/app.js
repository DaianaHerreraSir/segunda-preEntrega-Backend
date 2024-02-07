import express from "express"
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import CartManager from "./daos/cartManager.js"
import __dirname, { uploader } from "./utils.js";
import { Server as ServerIO } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from "./config/connectDB.js"
import  logger from "morgan"
import ProductsManagerMongo from "./daos/Mongo/productsManagerMongo.js";
import MessageManagerMongo from "./daos/Mongo/messageManagerMongo.js";
import messagesRouter from "./routes/message.router.js";
import productModel from "./models/products.models.js";
import viewRouter from "./routes/view.router.js";





const productManager = new ProductsManagerMongo() 
const messageManager = new MessageManagerMongo();
const cartManager = new CartManager()

const PORT= 8083;
const app= express();

connectDB()

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(logger("dev"))


//handlebars

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")



//vista del chat 

app.get("/chat", async(req,res)=>{
        res.render("chat")
})
app.post("/file",uploader.single("myFile"),(req,res) =>{
    res.send("imagen subida")
})

//rutas
app.use("/api/products",productsRouter);
app.use("/api/carts", cartsRouter )
app.use("/chat/message", messagesRouter)
app.use("/carts",cartsRouter)
app.use("/", viewRouter)

//productos actualizado en tiempo real

app.get('/realTimeProducts', async (req, res) => {
        try {
        const allProducts = await productManager.getProducts();
        res.render('realTimeProducts', { products: allProducts });
        } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).send('Error interno del servidor');
        }
});


//puerto
const httpServer = app.listen(PORT,()=>{
        console.log( ` Escuchando en el puerto ${PORT}`);
})

const socketServer = new ServerIO(httpServer);

// Websockets
socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado");

try {
        const allMessages = await messageManager.getAllMessages();
        socket.emit("messageLogs", allMessages);
    } catch (error) {
        console.error(error);
    }

    socket.on("message", async (data) => {
        try {
        
            const newMessage = await messageManager.addMessage(data.user, data.message);
            const allMessages = await messageManager.getAllMessages();
            socketServer.emit("messageLogs", allMessages);
        } catch (error) {
            console.error(error);
        }
    });



socket.on('newProduct', async (product) => {
        try {
            console.log('Evento newProduct recibido en el servidor:', product);
            const newProduct = { ...product, id: uuidv4() };
            console.log('Nuevo producto con ID único:', newProduct);
    
            await productManager.createProduct(newProduct);
            console.log('Producto agregado exitosamente.', newProduct);
    
            const updatedProducts = await productManager.getProducts();
    
            socketServer.emit('updateProducts', { products: updatedProducts });
            console.log('Todos los productos:', updatedProducts);
        } catch (error) {
            console.error('Error al agregar un nuevo producto:', error);
            socketServer.emit('updateProducts', { error: 'Error al agregar el producto' });
        }
    });

socket.on("deleteProduct", async (productId) => {
        try {
                await productManager.deleteProduct(productId);

        const updatedProducts = await productManager.getProducts()

socketServer.emit("updateProducts", { products: updatedProducts });
                console.log('Todos los productos:', updatedProducts);

        } catch (error) {
                console.error('Error al eliminar un producto:', error);

socketServer.emit('updateProducts', { error: 'Error al eliminar el producto' });
                }
        })
})



