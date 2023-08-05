
//for the chat
//=========================================
const socket = io();
//envio con emit el nombre de la funcion y los datos

// agregar producto con socket
const form= document.getElementById('AddProductForm').onsubmit = e => {
    e.preventDefault()

    const title = document.querySelector('input[name=title]').value
    const description = document.querySelector('input[name=description]').value
    const price = parseInt(document.querySelector('input[name=price]').value)
    const code = document.querySelector('input[name=code]').value
    const stock = parseInt(document.querySelector('input[name=stock]').value)
    const category = document.querySelector('input[name=category]').value

    const product = {title, description, price, thumbnail:[], code, stock, category, status: true}
    socket.emit('addNewProduct', product)
    form.reset();
}

socket.on("uploadList",productsList=>{
    console.log("lista uploaded", productsList);

   const tableBody= document.getElementById('tableProductsBody')
   let html='';
    productsList.forEach (product =>{
    html+= `<tr>
                <th scope="row">${product.code}</th>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>  <button type="button" class="btn btn-warning w-100 mb-1"  data-bs-toggle="modal" data-bs-target="#UploadProductModal" id="btn-upload">Modificar</button>
                <button type="button" class="btn btn-danger w-100 mb-1" id="btn-delete">Eliminar</button>
                </td>
            </tr>`
        })

    tableBody.innerHTML=html
});
// modificar producto desde socket
let btnUpload = document.getElementById("btn-upload");

btnUpload.addEventListener("click", (evt) => {
  console.log("entro en la funcion modificar", evt)
})
//eliminar producto desde socket
let btnDelete = document.getElementById("btn-delete");

btnDelete.addEventListener("click", (evt) => {
  console.log("entro en la funcion eliminar", evt)
})