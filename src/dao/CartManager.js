import fs from 'fs'
import { ProductManager } from './ProductManager.js'
import { error, log } from 'console'

export class CartManager{
    static #path = ''

    static setPath(rutaArchivo=''){
        this.#path = rutaArchivo
    }
    static async getCarts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:'utf-8'}))
        }else{
            return []
        }
    }
    static async #grabaArchivos(datos=''){
        if(typeof datos != 'string'){
            throw new Error('error metodo de grabado - argumento invalido')
        }
        await fs.promises.writeFile(this.#path, datos)
    }
    static async addCart(){
        let carts = await this.getCarts()
        let id = 1
        if(carts.length > 0){
            id = Math.max(...carts.map(d => d.id)) + 1
        }
        let nuevoCart = {
            id,
            products: []

        }
        carts.push(nuevoCart)
        await this.#grabaArchivos(JSON.stringify(carts, null, '\t'))
        return nuevoCart
    }
    static async addProductCart(cid,pid){
        let carts = await this.getCarts()
        let cart = carts[cid - 1]
        let quantity = 1

        
        let productAddCart = {
            pid:pid,
            quantity
        }


        cart.products.push(productAddCart)
        await this.#grabaArchivos(JSON.stringify(carts, null, '\t'))
        return productAddCart
    }
}