const socket =io();
//envio con emit el nombre de la funcion y los datos
socket.emit("message", "Comunicacion con websocket funcionando!!!")
socket.emit("chargeList")
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
                <td>${product.description}}</td>
                <td>${product.price}</td>
                <td>${product.categry}}</td>
                <td>${product.stock}</td>
            </tr>`
        })              
    
    tableBody.innerHTML=html
}) 