import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    thumbnail: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        unique: true, 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    status: { 
        type: Boolean, 
        default: true 
    },
});

productSchema.plugin(paginate);

export const productModel = model(productCollection, productSchema);