
const socket = io();

socket.on('connect', () => {
  console.log('Conectado al servidor de sockets');
});

const updateProductList = (products) => {
  console.log('updateProductList llamada con productos:', products);

  const productList = document.getElementById('productList');
  
  if (!productList) {
    console.error('Elemento productList no encontrado en el DOM.');
    return;
  }

  productList.innerHTML = '';

  if (Array.isArray(products) && products.length > 0) {
    products.forEach((product) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${product.title} - ${product.price}`;
      productList.appendChild(listItem);
    });
  } else {
    console.error('No contiene un array válido de productos:', products);

    productList.innerHTML = '<p>No hay productos disponibles.</p>';
  }
};


const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log('Formulario enviado');

  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;

  console.log('Enviando:', { title, price });
  
socket.emit('newProduct', { title, price });
});

socket.on('updateProducts', (data) => {
  try {
    console.log('Respuesta del servidor:', data);

    const response = data;

    if (response.error) {
      console.error('Error del servidor:', response.error);
  
    } else {
    
      const products = response.products || null;
      updateProductList(products);
    }

  } catch (error) {
    console.error('Error al procesar la respuesta del servidor:', error);
  
  }
})
  

const deleteForm = document.getElementById('deleteForm');

deleteForm.addEventListener('submit', async (event) => {
    
    event.preventDefault();
    console.log('Formulario de eliminación enviado');
    
const productId = document.getElementById('productId').value;

    console.log('Eliminando producto con ID:', productId);
    console.log('Estado de la conexión al servidor de sockets:', socket.connected);

    socket.emit('deleteProduct', productId);
});


socket.on('updateProducts', (data) => {
    try {
        console.log('Respuesta del servidor:', data);



    } catch (error) {
        console.error('Error al procesar la respuesta del servidor:', error);

    }
});


