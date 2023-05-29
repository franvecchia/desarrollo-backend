import { productModel } from "../models/Products.js";

export class ProductService {
    getProducts = async(limit,page,query,sort,url) => {
        let response = { payload: null, error: null };
        const filter = (query == null)? {}:{category: query};
        const options = (sort == null)? {limit: limit, page: page}: {limit: limit, page: page, sort: {price: sort}};
        const href = new URL(url)
        await productModel.paginate(filter, options).then((res) => {
            response.payload = res.docs;
            response.totalPages = res.totalPages;
            response.prevPage = res.prevPage;
            response.nextPage = res.nextPage;
            response.page = res.page;
            response.hasPrevPage = res.hasPrevPage;
            response.hasNextPage = res.hasNextPage;
            href.searchParams.set('page', res.prevPage);
            response.prevLink = res.prevPage && href.toString();
            href.searchParams.set('page', res.nextPage);
            response.nextLink = res.nextPage && href.toString();
            response.status = (isNaN(res.page))? 'error': (res.page > res.totalPages)? 'error':'success';
            response.code = (isNaN(res.page))? 400: (res.page > res.totalPages)? 400 : 200;
            response.message = (isNaN(res.page))? 'The page number is invalid': (res.page > res.totalPages)? 'The page number is invalid' : null;
        }).catch((error) => {
            response.error = error.errors;
            response.message = error.message;
            response.status = 'error';
            response.code = 400;
        });

        return response;
    }

    getProductById = async(id) => {
        let response = { payload: null, error: null };
        await productModel.findById(id).then((res) => {
            response.payload = res;
            response.message = (res !== null)? "Product found": "Product not found";
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

    addProduct = async(product) => {
        let response = { payload: null, error: null };
        await productModel.create(product).then((res) => {
            response.payload = res;
            response.message = "Product added successfully";
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

    updateProduct = async(id, {title, description, price, thumbnail, code, stock, category, status}) => {
        let response = { payload: null, error: null };

        await productModel.findById(id).then(async(prod) => {
            title = title ?? prod.title;
            description = description ?? prod.description;
            price = price ?? prod.price;
            thumbnail = thumbnail ?? prod.thumbnail;
            code = code ?? prod.code;
            stock = stock ?? prod.stock;
            category = category ?? prod.category;
            status = status ?? prod.status;

            await productModel.updateOne({_id: id}, {title, description, price, thumbnail, code, stock, category, status}).then((res) => {
                response.payload = res;
                response.message = "Product successfully updated";
                response.status = 'success';
                response.code = 200;
            }).catch((err) => {
                response.error = err.errors;
                response.message = err.message;
                response.status = 'error';
                response.code = 400;
            }) ;
        }).catch((error) => {
            response.error = error.errors;
            response.message = error.message;
            response.status = 'error';
            response.code = 400;
        });

        return response;
    }

    deleteProduct = async(id) => {
        let response = { payload: null, error: null };

        await productModel.findOneAndRemove({_id: id}).then((res) => {
            response.payload = res;
            response.message = "Product satisfactorily removed";
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

    updateStockProduct = async(product,cant) => {
        await productModel.updateOne({_id: product._id}, {stock: product.stock + cant});
    }
}