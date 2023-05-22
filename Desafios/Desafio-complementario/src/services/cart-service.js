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

    getCartById = async(id) => {
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

    addProductToCart = async(cid, pid) => {
        let response = { payload: null, error: null };
        const resProd = await productService.getProductById(pid);
        const resCart = await this.getCartById(cid);
        if (resProd.payload !== null && resCart.payload !== null) {
            const cart = resCart.payload;
            const prods = cart.products;
            const prod = resProd.payload;
            await cartModel.updateOne({_id: cid}, (prods.some(p => p.id_prod.toString() == prod._id))? 
                {products: prods.map(p => (p.id_prod.toString() == prod._id)? {id_prod: prod._id, cant: p.cant + 1}:p)} :
                {products: [...prods, {id_prod: prod._id, cant: 1}]}
            ).then(async(res) => {
                await productService.updateStockProduct(prod);
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
        response = (resCart.payload !== null)? resProd : resCart;
        return response;
    }
}