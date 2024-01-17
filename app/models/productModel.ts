import { Document, Model, Schema, model, models } from "mongoose";
import categories from "@utils/categories";
import { NewProduct } from "../types";

// document 가 아니라 NewProduct 에서 확장해 만듬.
export interface ProductDocument extends NewProduct {
  // virtual property
  sale: number;
}

const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bulletPoints: { type: [String] },
    thumbnail: {
      type: Object,
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    price: {
      base: { type: Number, required: true },
      discounted: { type: Number, required: true },
    },
    quantity: { type: Number, required: true },
    category: { type: String, enum: [...categories], required: true },
    rating: { type: Number },
  },
  { timestamps: true }
);

// virtual field
productSchema.virtual("sale").get(function (this: ProductDocument) {
  return Math.round(
    ((this.price.base - this.price.discounted) / this.price.base) * 100
  );
});

const ProductModel = models.Product || model("Product", productSchema);

export default ProductModel as Model<ProductDocument>;
