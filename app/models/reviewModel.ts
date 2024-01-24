import { Model, Schema, models, Document, ObjectId, model } from "mongoose";

interface ReviewDocuments extends Document {
  userId: ObjectId;
  product: ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const reviewShcema = new Schema<ReviewDocuments>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const ReviewModel = models.Review || model("Review", reviewShcema);

export default ReviewModel as Model<ReviewDocuments>;
