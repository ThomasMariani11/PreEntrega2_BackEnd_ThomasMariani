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

    socket.on('productoAgregarVista',productoAgregar => {
        let parrafo = document.createElement('ul')
        parrafo.innerHTML = ` <li>
                                <p>${productoAgregar}</p>
                                <p>${productoAgregar}</p>
                                <p>${productoAgregar}</p>

                            </li>`
        divProducts.appendChild(parrafo)
    })

    inputAgregar.addEventListener('keyup', e => {
        e.preventDefault()

        if(e.code === 'Enter'){
            if(e.target.value.trim().length > 0){
                
                socket.emit('productoAgregar',  e.target.value)
                e.target.value = ''

            }
        }
    })
    inputEliminar.addEventListener('keyup', e => {
        e.preventDefault()

        if(e.code === 'Enter'){
            if(e.target.value.trim().length > 0){
                socket.emit('productoEliminar',  e.target.value.trim())
                e.target.value = ''

            }
        }
    })
})