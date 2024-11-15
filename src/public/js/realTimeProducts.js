Swal.fire({
    title: "Identifiquese",
    input: "text",
    text:  "ingrese su nickname",
    inputValidator : (value) => {
        return !value && 'debe ingresar un nombre'
    },
    allowOutsideClick: false
})
    .then(() => {
    const socket = io()

    let inputAgregar = document.getElementById('agregar')
    let inputEliminar = document.getElementById('eliminar')
    let divProducts = document.getElementById('products')

    socket.on('productoAgregarVista', (productoAgregar, precio, stock, nuevoProduct) => {
        let parrafo = document.createElement('ul')
        parrafo.innerHTML = ` <li>
                                <p>Producto: ${productoAgregar}</p>
                                <p>ID: ${nuevoProduct.id}</p>
                                <p>Precio: $${precio}</p>
                                <p>Stock: ${stock}</p>

                            </li>`
        Swal.fire(`El producto fue agregado`)
        divProducts.appendChild(parrafo)
    })
    socket.on('productoEliminarVista', productoEliminado => {
        Swal.fire(`El producto con id ${productoEliminado} fue eliminado`)
    })


    inputAgregar.addEventListener('keyup', e => {
        e.preventDefault()

        if(e.code === 'Enter'){
            if(e.target.value.trim().length > 0){
                Swal.fire({
                    title: "agregue un precio al producto",
                    input: "text",
                    text:  "ingrese precio",
                    inputValidator : (value) => {
                        return !value && 'debe ingresar un precio'
                    },
                    allowOutsideClick: false
                }) .then(resultado => {
                    let {value:precio} = resultado
                    socket.emit('productoAgregar',  e.target.value, precio, stock=15)
                    e.target.value = ''
                })


            }
        }
    })
    inputEliminar.addEventListener('keyup', e => {
        e.preventDefault()

        if(e.code === 'Enter'){
            if(e.target.value.length > 0){
                socket.emit('productoEliminar',  e.target.value)
                e.target.value = ''
            }
        }
    })
})