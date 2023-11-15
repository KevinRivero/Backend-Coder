import express from 'express'
import handleblars from 'express-handlebars'
import {Server} from 'socket.io'

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import { __dirname } from './utils.js'

const PORT = 8080
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(__dirname + '/public'))

//se va a utilizar para llamar al socket.io

const httpserver = app.listen(PORT, () => { //este seria el HTTP server
    console.log(`Servidor express activo en puerto ${PORT}`)
})

const socketServer = new Server(httpserver)

socketServer.on('connection', socket => {
    console.log(socket.id);
})

//incorporacion de motores de plantillas - handlebars
app.engine('handlebars', handleblars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

//endpoints
//para motor de plantilla
app.use('/view', viewsRouter)
//Products
app.use('/api/products', productsRouter)
//Carts
app.use('/api/carts', cartsRouter)


app.use('/static', express.static(`${__dirname}/public`))


