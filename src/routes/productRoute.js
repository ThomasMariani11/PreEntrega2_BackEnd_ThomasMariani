import { Router } from "express"
import { ProductManager } from '../dao/ProductManager.js'
import { procesaErrores } from "../utils.js"
import { productosAgregar } from "../app.js"
import { productosEliminar } from '../app.js'
export const router = Router()


ProductManager.setPath('./src/data/products.json')

router.get('/', async (req, res) => {
    let products = await ProductManager.getProducts()
    res.render('home',{
        products
    })
})
router.get('/realtimeproducts', async (req, res) => {
    let products = await ProductManager.getProducts()
    
    res.render('realTimeProducts',{
        products
    })
})


router.get('/:pid', async (req, res) => {
    let products = await ProductManager.getProducts()

    let {pid} = req.params
    pid = Number(pid)

    if(isNaN(pid)){
        return res.status(400).send('error, el id debe ser numerico')
    }
    let product = products.find( p => p.id === pid)
    if(!product){
        return res.status(404).send(`no existe el producto con id ${pid}`)
    }
    res.status(200).send(product)

})
router.post('/', async (req, res) => {
    let {titulo,descripcion,codigo,precio,stock,categoria,...thumbnails} = req.body
    if(!titulo || !descripcion || !codigo || !precio || !stock || !categoria){
        res.setHeader('Content-Type','aplication/json')
        return res.status(400).json({error:'le esta faltando alguna propiedad por ingresar'})
    }
    precio = Number(precio)
    stock = Number(stock)
    if(isNaN(precio) || isNaN(stock)){
        res.setHeader('Content-Type','aplication/json')
        return res.status(400).json({error:'precio y stock deben ser numericos'})
    }
    try{   
        let products = await ProductManager.getProducts()
        let existe = products.find(p => p.titulo  === titulo)
        if(existe){
            res.setHeader('Content-Type','aplication/json')
            return res.status(400).json({error:'ya existe el producto'})
        }else{
            
            let nuevoProduct = await ProductManager.addProduct({titulo,descripcion,codigo,precio,stock,categoria,...thumbnails})
            
            
            res.setHeader('Content-Type','aplication/json')
            return res.status(200).json({nuevoProduct})
        }
    }catch(error){
        procesaErrores(res, error)
        
    }
})
router.put('/:pid', async (req, res) => {
    try{    
        let {pid} = req.params
        let {titulo,descripcion,codigo,precio,stock,categoria} = req.body
        pid = Number(pid)
        precio = Number(precio)
        stock = Number(stock)
        
        
        if(isNaN(pid) || isNaN(precio) || isNaN(stock)){
            return res.status(400).send('error, el id, precio y stock debe ser numerico')
        }
        if(!titulo ||!descripcion ||!codigo ||!categoria ||!precio ||!stock){
            return res.status(404).send('faltan propiedades a modificar')
        }
        if(!pid){
            return res.status(404).send(`no existe el producto con id ${pid}`)
        }
        let productoAModificar = await ProductManager.modifyProduct(titulo,descripcion,codigo,precio,stock,categoria,pid)
        
        
    
        res.status(200).json({productoModificado: productoAModificar})
    }catch(error){
        procesaErrores(res, error)
    }



})
router.delete('/:pid', async (req, res) => {
    let {pid} = req.params
    pid = Number(pid)
    if(isNaN(pid)){
        res.setHeader('Content-Type','aplication/json')
        return res.status(400).json({error:'pos debe ser numerico'})
    }
    try{
        let productoEliminado = await ProductManager.deleteProducts(pid)
        res.setHeader('Conten-Type','application/json')
        return res.status(200).send({productoEliminado})

    }catch(error){
        procesaErrores(res, error)
    }



})