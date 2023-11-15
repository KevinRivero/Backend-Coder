import { Router } from "express";
import { ProductManager } from '../ProductManager.js'

const router = Router()

const productManager = new ProductManager('../products.json')

// Para manejo de errores
const errorHandler = (err, req, res, next) => {
    console.error(err)
    if(err instanceof Error){
        res.status(400).send({error: err.message})
    }else{
        next(err)
    }
}

//GET
//Obtener productos
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts()

        if (limit) {
            const productsLimit = products.slice(0, limit)
            res.status(200).send(productsLimit)
        } else {
            res.status(200).send(products)
        }
    } catch (err) {
        res.status(400).send({ err: err.message })
    }

})

// Obtener productos por su id
router.get('/:pid', async (req, res,next) => {
    try {
        const pid = parseInt(req.params.pid)
        const product =  await productManager.getProductById(pid)
        res.send(product)
    } catch (err) {
        next(err)
    }

})

//POST
//Agregar un producto
router.post('/', async (req, res,next) => {
    try{
        const product = req.body
        await productManager.addProduct(product)
        const newProduct = await productManager.getProductByCode(product.code)
        res.status(200).send(newProduct)
    } catch(err){
        next(err)
    }
    
})

//PUT
// Actualizar un producto 
router.put('/:pid', async (req, res, next) => {
    try{
        const newData = req.body
        const productId = parseInt(req.params.pid)
        await productManager.updateProduct(productId, newData)
        const updatedProduct = await productManager.getProductById(productId)
        res.status(200).send(updatedProduct)
    } catch(err){
        next(err)
    }
    
})

//DELETE 
// Borrar un producto
router.delete('/:pid', async (req, res,next) => {
    try{
        const productId = parseInt(req.params.pid)
        await productManager.deleteProduct(productId)
        res.status(200).send(`The product with id ${productId} was deleted`)
    }catch(err){
        next(err)
    }
})

// middleware para manejo de errores. Lo utilizo para poder hacer la logica en los metodos de ProductManager y dejar mas limpios los endpoints
router.use(errorHandler)

export default router


