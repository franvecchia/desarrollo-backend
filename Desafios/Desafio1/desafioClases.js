class productManager {
    constructor() {
        this.productos = [];
    }

    addProduct(product) {
        if (this.productos.find(producto => producto.code == product.code)) {
            return "Producto existente";
        } else {
            this.productos.push(product);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(function(producto) {
            if (producto.id == id) {
                return product;
            } else {
                return "Producto no encontrado.";
            }
        })
    }
}

class Product {
    constructor(titulo="", descripcion="", precio=0, miniatura="", codigo="", stock=0) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.miniatura = miniatura;
        this.codigo = codigo;
        this.stock = stock;
        this.id = Product.incrementarID();
    }

    static incrementarID() {
        if (this.idIncrement) {
            this.idIncrement++;
        } else {
            this.idIncrement = 1;
        }
        return this.idIncrement;
    }
}