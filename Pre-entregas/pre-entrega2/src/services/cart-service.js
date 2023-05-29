import { cartModel } from "../models/cart.js";
import { ProductService } from "./product-service.js";

const productService = new ProductService();

export class CartService {

    createEmptyCart = async() => {
        let response = { payload: null, error: null };
        await cartModel.create({}).then((res) => {
            response.payload = res;
            response.message = "Cart added successfully";
            response.status = 'success';
            response.code = 201;
        }).catch((error) => {
            response.error = error.errors;
            response.message = error.message;
            response.status = 'error';
            response.code = 400;
        });

        return response;
    }

    getCartByIdPopulate = async(id) => {
        let response = { payload: null, error: null };
        await cartModel.findById(id).populate("products.id_prod").then((res) => {
            response.payload = res;
            response.message = (res !== null)? "Cart found": "Cart not found";
            response.status = (res !== null)? 'success': 'error';
            response.code = (res !== null)? 200: 400;
        }).catch((error) => {
            response.error = error.errors;
            response.message = error.message;
            response.status = 'error';
            response.code = 400;
        });

        return response;
    }

    getCartById = async(id) => {
        let response = { payload: null, error: null };
        await cartModel.findById(id).then((res) => {
            response.payload = res;
            response.message = (res !== null)? "Cart found": "Cart not found";
            response.status = (res !== null)? 'success': 'error';
            response.code = (res !== null)? 200: 400;
        }).catch((error) => {
            response.error = error.errors;
            response.message = error.message;
            response.status = 'error';
            response.code = 400;
        });

        return response;
    }

    addProductToCart = async(cid, pid) => {
        let response = { payload: null, error: null };
        const resProd = await productService.getProductById(pid);
        const resCart = await this.getCartById(cid);
        if (resProd.payload !== null && resCart.payload !== null) {
            const cart = resCart.payload;
            const prods = cart.products;
            const prod = resProd.payload;
            if(prod.stock > 0) {
                await cartModel.updateOne({_id: cid}, (prods.some(p => p.id_prod.toString() == prod._id))? 
                    {products: prods.map(p => (p.id_prod.toString() == prod._id)? {id_prod: prod._id, cant: p.cant + 1}:p)} :
                    {products: [...prods, {id_prod: prod._id, cant: 1}]}
                ).then(async(res) => {
                    await productService.updateStockProduct(prod,-1);
                    response.payload = res;
                    response.message = "Cart modified successfully";
                    response.status = 'success';
                    response.code = 200;
                }).catch((error) => {
                    response.error = error.errors;
                    response.message = error.message;
                    response.status = 'error';
                    response.code = 400;
                });
                return response;
            }

            return { payload: null, error: 'There is not enough stock of the product', message: this.error, status: 'error', code: 400};
        }
        response = (resCart.payload !== null)? resProd : resCart;
        return response;
    }

    deleteProductToCart = async(cid, pid) => {
        let response = { payload: null, error: null };

        const resCart = await this.getCartById(cid);
        const resProd = await productService.getProductById(pid);
        if (resProd.payload !== null && resCart.payload !== null) {
            const cart = resCart.payload;
            const prods = cart.products;
            const prod = resProd.payload;
            if (prods.some(p => p.id_prod.toString() == prod._id)) {
                const i = prods.findIndex((p) => p.id_prod.toString() == prod._id);
                const prodRemove = prods.splice(i,1);
                await cartModel.updateOne({_id: cid}, {products: prods}).then(async(res) => {
                    await productService.updateStockProduct(prod,prodRemove[0].cant);
                    response.payload = res;
                    response.message = "Product removed from cart successfully";
                    response.status = 'success';
                    response.code = 200;
                }).catch((error) => {
                    response.error = error.errors;
                    response.message = error.message;
                    response.status = 'error';
                    response.code = 400;
                });
                return response;
            }

            return { payload: null, error: 'The product does not belong to the cart', message: this.error, status: 'error', code: 400};
        }
        response = (resCart.payload !== null)? resProd : resCart;
        return response;
    }

    updateCartByProductList = async(cid, products) => {
        let response = { payload: null, error: null };

        const resCart = await this.getCartById(cid);
        let resProds = await this.findProductstoCart(products);
        if (resCart.payload !== null && resProds.length > 0) {
            await this.deleteProductsToCart(cid);
            resProds = await this.findProductstoCart(products);
            const prodsId = resProds.map((p) => p._id.toString());
            const listProducts = products.filter((p) => prodsId.includes(p.id_prod)).map((p,i) => ({id_prod: p.id_prod, cant: (p.cant <= resProds[i].stock)? p.cant:resProds[i].stock}));
            await cartModel.updateOne({_id: cid}, {products: listProducts}).then(async(res) => {
                for (let i = 0; i < resProds.length; i++) {
                    await productService.updateStockProduct(resProds[i],-listProducts[i].cant);
                }
                response.payload = res;
                response.message = `Cart updated successfully${(products.length == resProds.length)?'':', '+ (products.length-resProds.length) +' product(s) not found in the database'}`;
                response.status = 'success';
                response.code = 200;
            }).catch((error) => {
                response.error = error.errors;
                response.message = error.message;
                response.status = 'error';
                response.code = 400;
            });
            return response;
        }
        response = (resCart.payload !== null)? {payload: null, error: 'The products are not found in the Database', message: this.error, status: 'error', code: 400} : resCart;
        return response;
    }

    updateCartProductQuantity = async(cid, pid, cant) => {
        let response = { payload: null, error: null };

        const resCart = await this.getCartById(cid);
        const resProd = await productService.getProductById(pid);
        if (resProd.payload !== null && resCart.payload !== null && cant > 0) {
            const cart = resCart.payload;
            const prods = cart.products;
            const prod = resProd.payload;
            if (prods.some(p => p.id_prod.toString() == prod._id)) {
                const i = prods.findIndex((p) => p.id_prod.toString() == prod._id);
                const diffCant = (cant - prods[i].cant <= prod.stock)? cant - prods[i].cant: prod.stock;
                prods[i].cant = prods[i].cant + diffCant;
                await cartModel.updateOne({_id: cid}, {products: prods}).then(async(res) => {
                    await productService.updateStockProduct(prod,-diffCant);
                    response.payload = res;
                    response.message = "Quantity of products successfully updated";
                    response.status = 'success';
                    response.code = 200;
                }).catch((error) => {
                    response.error = error.errors;
                    response.message = error.message;
                    response.status = 'error';
                    response.code = 400;
                });
                return response;
            }
            return { payload: null, error: 'The product does not belong to the cart', message: this.error, status: 'error', code: 400};
        }
        response = (resCart.payload !== null)? ((resProd.payload != null)? {payload: null, error: 'Quantity must be greater than 0', message: this.error, status: 'error', code: 400} : resProd) : resCart;
        return response;
    };

    deleteProductsToCart = async(cid) => {
        let response = { payload: null, error: null };

        const resCart = await this.getCartById(cid);
        if (resCart.payload !== null) {
            const cart = resCart.payload;
            const prods = cart.products;
            const resProds = await this.findProductstoCart(prods);
            await cartModel.updateOne({_id: cid}, {products: []}).then(async(res) => {
                for (let i = 0; i < prods.length; i++) {
                    await productService.updateStockProduct(resProds[i],prods[i].cant);
                }
                response.payload = res;
                response.message = "Products removed from cart successfully";
                response.status = 'success';
                response.code = 200;
            }).catch((error) => {
                response.error = error.errors;
                response.message = error.message;
                response.status = 'error';
                response.code = 400;
            });
            return response;
        }
        response = resCart;
        return response;
    }

    findProductstoCart = async(products) => {
        const arr = [];
        for (let i = 0; i < products.length; i++) {
            arr.push((await productService.getProductById(products[i].id_prod)).payload);
        }
        return arr.filter((p) => p !== null);
    }
}