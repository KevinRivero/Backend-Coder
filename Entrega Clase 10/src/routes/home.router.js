import { Router } from "express"
import { Cart } from "../Cart"
import { ProductManager } from "../ProductManager"

const router = Router()
const cartInstance = new Cart()

//instancio un productManager para poder acceder a los productos
const productManager = new ProductManager('../products.json')

router.get('/', async(req, res) => {
    const products = await productManager.getProducts()
    
})