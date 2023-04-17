import {promises as fs} from 'fs'

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    static incrementarID() {
        if(this.idIncrement) {
            this.idIncrement++;
        } else {
            this.idIncrement = 1;
        }
        return this.idIncrement;
    }

    async addProduct(producto) {
        const prodsJSON = await fs.readFile(this.path, 'utf-8');
        const prods = JSON.parse(prodsJSON);
        producto.id = productManager.incrementarID();
        prods.push(producto);
        await fs.writeFile(this.path, JSON.stringify(prods));
        return "Producto Creado.";
    }

    async getProducts() {
        const prods = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(prods);
    }

    async getProductById(id) {
        const prodsJSON = await fs.readFile(this.path, 'utf-8');
        const prods = JSON.parse(prodsJSON);
        if (prods.some(prod => prod.id === parseInt(id))) {
            return prods.find(prod => prod.id === parseInt(id));
        } else {
            return "Producto no encontrado.";
        }
    }

    async updateProduct(id, {titulo, descripcion, precio, miniatura, codigo, stock}) {
        const ProdsJSON = await fs.readFile(this.path, 'utf-8');
        const prods = JSON.parse(ProdsJSON);
        if (prods.some(prod => prod.id === parseInt(id))) {
            let index = prods.findIndex(prod => prod.id === parseInt(id))
            prods[index].titulo = titulo;
            prods[index].descripcion = descripcion;
            prods[index].precio = precio;
            prods[index].miniatura = miniatura;
            prods[index].codigo = codigo;
            prods[index].stock = stock;
            await fs.writeFile(this.path, JSON.stringify(prods));
            return "Producto actualizado.";
        } else {
            return "Producto no encontrado.";
        }
    }

    async deleteProduct(id) {
        const ProdsJSON = await fs.readFile(this.path, 'utf-8');
        const prods = JSON.parse(ProdsJSON);
        if (prods.some(prod => prod.id === parseInt(id))) {
            const prodsFiltrados = prods.filter(prod => prod.id !== parseInt(id));
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados));
            return "Producto eliminado.";
        } else {
            return "Producto no encontrado.";
        }
    }
}

const prod = new ProductManager('./info.txt');

prod.getProducts().then(prod => console.log(prod));

export default ProductManager;