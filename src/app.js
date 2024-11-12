import express from 'express'
import {engine} from 'express-handlebars'
import {router as productRoute} from './routes/productRoute.js'
import { router as cartRoute } from './routes/cartRoute.js'
import {Server} from 'socket.io'

const PORT = 8080
const app = express()

const rutaArchivo = './src/data/products.json'
const rutaArchivoCart = './src/data/cart.json'



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./src/public'))
app.engine('handlebars', engine())
app.set('view engine','handlebars');
app.set('views','./src/views')

app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)



const server = app.listen(PORT, () => {
    console.log(`servidor corriendo en puerto ${PORT}`);
    
})
const io = new Server(server)