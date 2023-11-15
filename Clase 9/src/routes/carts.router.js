import { Router } from "express";
import {Cart} from '../Cart.js';


const router = Router()
const cartInstance = new Cart()

// para manejo de errores
const cartErrorHandler = (err,req,res,next) => {
    console.error(err)
    if(err instanceof Error){
        res.status(400).send({error : err.message})
    }else{
        next(err)
    }
}

// POST
router.post('/', async (req,res) => {
    const cart = new Cart()
    await cart.addCart(cart)
    res.status(200).send(cart)
})

router.post('/:cid/product/:pid', async(req, res, next)=> {
    try{
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)

        await cartInstance.addProduct(cartId, productId, 1)
        const cart = await cartInstance.getCart(cartId)
        res.status(200).send(cart)
    }catch(err){
        next(err)
    }
})

//GET
router.get('/:cid', async(req,res,next) => {
    try{
        const cartId = parseInt(req.params.cid)
        const cart = await cartInstance.getCart(cartId)
        res.status(200).send(cart)
    }catch(err){
        next(err)
    }
    

})

//middleware para manejo de errores
router.use(cartErrorHandler)

export default router