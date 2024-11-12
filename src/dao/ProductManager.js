import fs from 'fs'


export class ProductManager{
    static #path = ''

    static setPath(rutaArchivo=''){
        this.#path = rutaArchivo
    }
    static async getProducts(){
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
    static async addProduct(producto={}){
        let products = await this.getProducts()
        let id = 1
        if(products.length > 0){
            id = Math.max(...products.map(d => d.id)) + 1
            console.log(id)
        }
        let nuevoProduct = {
            id,
            status:true,
            ...producto
        }
        products.push(nuevoProduct)
        await this.#grabaArchivos(JSON.stringify(products, null, '\t'))
        return nuevoProduct
    }
    static async modifyProduct(titulo,descripcion,codigo,precio,stock,categoria, pid){
        let products = await ProductManager.getProducts()
        let productoAnterior = products[pid - 1]
        productoAnterior.status = true
        productoAnterior.titulo = titulo
        productoAnterior.descripcion = descripcion
        productoAnterior.codigo = codigo
        productoAnterior.precio = precio
        productoAnterior.stock = stock
        productoAnterior.categoria = categoria
        await this.#grabaArchivos(JSON.stringify(products, null, '\t'))
        return productoAnterior

        
    }
    static async deleteProducts(pid){
        let products = await ProductManager.getProducts()
        let productoEliminado = products[pid - 1]
        products.splice(pid - 1, 1)
        await this.#grabaArchivos(JSON.stringify(products, null, '\t'))
        return productoEliminado
    }
}
