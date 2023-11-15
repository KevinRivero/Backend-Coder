import fs from 'fs'
import { ProductManager } from './ProductManager.js'


export class Cart {

    static iterator = 0
    static PATH = '../carts.json'
       
    constructor() {
        this.id = Cart.iterator
        Cart.iterator++
        this.products = []   
    }

    async addCart(cart) {
        const recoveredCartsJson = await this.getCarts()
        recoveredCartsJson.push(cart)

        await fs.promises.writeFile(Cart.PATH, JSON.stringify(recoveredCartsJson,null,2))
    } 

    //metodo para no repetir lineas de codigo, no se utiliza en ningun endpoint
    async getCarts() {
        const recoveredCarts = await fs.promises.readFile(Cart.PATH)
        const recoveredCartsJson = JSON.parse(recoveredCarts)
        return recoveredCartsJson
    }

    async getCart(id){
        const recoveredCarts = await this.getCarts()
        const cart = recoveredCarts.find(prod => prod.id === id)
        if(cart){
            return cart
        }else{
            throw new Error('Id not found')
        }
    }


    async addProduct(cartId, productId,quantity) {

        const recoveredCarts = await this.getCarts()
        const cartIndex = recoveredCarts.findIndex(cart => cart.id === cartId)
        if(cartIndex === -1){
            throw new Error('Cart id not found')
        }

        const productManager = new ProductManager('../products.json')
        const product = await productManager.getProductById(productId)
        const productIndex = recoveredCarts[cartIndex].products.findIndex(p => p.product === productId)

        if(!product){
            throw new Error('Product id not found')
        }

        if(productIndex === -1){
           recoveredCarts[cartIndex].products.push({
                product: product.id,
                quantity: parseInt(quantity)
            })
        }else{
            recoveredCarts[cartIndex].products[productIndex].quantity += quantity
        }

        await fs.promises.writeFile(Cart.PATH, JSON.stringify(recoveredCarts),null,2)

    }
    
}





