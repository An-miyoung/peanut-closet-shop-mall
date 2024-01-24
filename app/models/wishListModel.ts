import { Model, ObjectId, Schema, model, models } from "mongoose";

interface WishlistDocument extends Document {
  user: ObjectId;
  products: ObjectId[];
}

const wishlistSchema = new Schema<WishlistDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
  },
  { timestamps: true }
);

const WishlistModel = models.Wishlist || model("Wishlist", wishlistSchema);

export default WishlistModel as Model<WishlistDocument>;
