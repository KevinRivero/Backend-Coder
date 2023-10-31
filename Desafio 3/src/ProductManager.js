import fs from 'fs'

export class ProductManager {

    static id = 0

    constructor(path) {
        this.path = path
    }


    async addProduct(product) {
        try {
            const { title, description, price, thumbnail, code, stock } = product

            ProductManager.id++

            //se trae los productos previamente guardados en el archivo
            const recoveredProducts = await this.getProducts()

            //se corrobora que no esté duplicado según su código
            const isDuplicate = recoveredProducts.some(p => p.code === code)

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("missing fields to complete")
                return
            }

            if (isDuplicate) {
                console.log('The code already exists')
                return
            }
            product.id = ProductManager.id
            recoveredProducts.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(recoveredProducts, null, 2))
        } catch (e) {
            console.error(e.message)
        }
    }

    async getProducts() {
        try {
            const recoveredProducts = await fs.promises.readFile(this.path)
            const recoveredProductsJson = JSON.parse(recoveredProducts)
            return recoveredProductsJson
        } catch (e) {
            console.error(e.meesage)
        }
    }

    async getProductById(id) {
        const recoveredProducts = await this.getProducts()
        const product = await recoveredProducts.find(prod => prod.id === id)
        if (product) {
            return product
        } else {
            console.log('Not found');
            return null
        }
    }

    async updateProduct(id, newData) {
        const recoveredProducts = await this.getProducts()
        const productIndex = recoveredProducts.findIndex((p) => p.id === id)
        if (productIndex === -1) {
            console.log('Not found')
            return
        }
        recoveredProducts[productIndex] = { ...recoveredProducts[productIndex], ...newData }
        await fs.promises.writeFile(this.path, JSON.stringify(recoveredProducts, null, 2))
    }

    async deleteProduct(id) {
        const recoveredProducts = await this.getProducts()
        await fs.promises.unlink(this.path)

        const filteredProducts = recoveredProducts.filter((p) => p.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2))
    }

}



