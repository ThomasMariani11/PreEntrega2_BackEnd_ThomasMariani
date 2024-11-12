import { Router } from "express"
import { procesaErrores } from "../utils.js"
import { CartManager } from "../dao/CartManager.js"
import { ProductManager } from '../dao/ProductManager.js'
export const router = Router()

CartManager.setPath('./src/data/cart.json')

router.get('/:cid', async (req, res) => {
    let cartProducts = await CartManager.getCarts()
    let {cid} = req.params
    cid = Number(cid)
    if(isNaN(cid)){
        res.setHeader('Content-Type','aplication/json')
        return res.send('el id debe ser numerico')
    }

    let respuesta = cartProducts[cid].products

    res.setHeader('Content-type','text/plain')
    res.status(200).json({productosEnCarrito:respuesta})
})



router.post('/', async (req, res) => {
    try{   
            let nuevoCart = await CartManager.addCart()
            res.setHeader('Content-Type','aplication/json')
            return res.status(200).json({nuevoCart})
    }catch(error){
        procesaErrores(res, error)
        
    }
})
router.post('/:cid/product/:pid', async (req, res) => {
    let {cid,pid} = req.params
    pid = Number(pid)
    cid = Number(cid)
    if(isNaN(cid) || isNaN(pid)){
        res.setHeader('Content-Type','aplication/json')
        return res.send('el id debe ser numerico')
    }
    let products = await ProductManager.getProducts()
    let existe = products.find(p => p.id === pid) 
    if(!existe){        
        res.setHeader('Content-Type','aplication/json')
        return res.send('no existe producto')
    }    
    
    try{   
        let nuevoProduct = await CartManager.addProductCart(cid,pid)
        res.setHeader('Content-Type','aplication/json')
        return res.status(200).json({nuevoProduct})
        

    }catch(error){
        procesaErrores(res, error)
    }
})