import fs from 'fs'

export class ProductManager {

    // se inicia el id en 10 porque están cargados previamente 10 productos en el archivo
    static id = 10

    constructor(path) {
        this.path = path
    }


    async addProduct(product) {
            const { title, description, price, thumbnail, code, stock, category, status } = product

            //se trae los productos previamente guardados en el archivo
            const recoveredProducts = await this.getProducts()

            //se corrobora que no esté duplicado según su código
            const isDuplicate = recoveredProducts.some(p => p.code === code)

            if (!title || !description || !price || !code || !stock || !category || !status) {
                throw new Error("missing fields to complete")
            }

            if (isDuplicate) {
                throw new Error('The code already exists')
            }
            ProductManager.id++
            product.id = ProductManager.id
            recoveredProducts.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(recoveredProducts, null, 2))
    }

    async getProducts() {
            const recoveredProducts = await fs.promises.readFile(this.path)
            const recoveredProductsJson = JSON.parse(recoveredProducts)
            return recoveredProductsJson
    }

    async getProductById(id) {
        const recoveredProducts = await this.getProducts()
        const product = recoveredProducts.find(prod => prod.id === id)
        if (product) {
            return product
        } else {
            throw new Error('Id not found');
        }
    }

    // se agrega esta función para poder buscar por código, por el momento para devolver el producto cargado en el método POST
    async getProductByCode(code) {
        const recoveredProducts = await this.getProducts()
        const product = await recoveredProducts.find(prod => prod.code === code)
        if (product) {
            return product
        } else {
            throw new Error('Code not found')
        }
    }

    async updateProduct(id, newData) {
        const recoveredProducts = await this.getProducts()
        const productIndex = recoveredProducts.findIndex((p) => p.id === id)
        if (productIndex === -1) {
           throw new Error('Id not found')
        }
        recoveredProducts[productIndex] = { ...recoveredProducts[productIndex], ...newData }
        await fs.promises.writeFile(this.path, JSON.stringify(recoveredProducts, null, 2))
    }

    async deleteProduct(id) {
        const recoveredProducts = await this.getProducts()
        const product = await this.getProductById(id)
        if(!product){
            throw new Error('The product does not exist')
        }
        await fs.promises.unlink(this.path)

        const filteredProducts = recoveredProducts.filter((p) => p.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2))
    }

}



