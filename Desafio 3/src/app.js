import express from 'express'
import { ProductManager } from './ProductManager.js'

const PORT = 8080
const app = express()
app.use(express.urlencoded({extended:true}))

const productManager = new ProductManager('../products.txt')


app.get('/products', async (req,res) =>{

    const limit = req.query.limit
    const products = await productManager.getProducts()
    
    if(limit){
        const productsLimit = products.slice(0,limit)
        res.send(productsLimit)
    }else{
        res.send(products)
    }
})

app.get('/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid)
    console.log('pid' + pid);
    if(!pid){
        console.log("The products doesn't exist")
        return
    }
    const product = await productManager.getProductById(pid)
    res.send(product)
})

app.listen(PORT, () => {
    console.log(`Servidor express activo en puerto ${PORT}`)
})
