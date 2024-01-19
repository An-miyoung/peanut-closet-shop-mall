import { Schema, model, models, Model } from "mongoose";
import { string } from "yup";

interface FeaturedProductDocument extends Document {
  banner: { url: string; id: string };
  title: string;
  link: string;
  linkTitle: string;
}

const featuredproductSchema = new Schema<FeaturedProductDocument>({
  banner: {
    url: { type: String, required: true },
    id: { type: String, required: true },
  },
  title: { type: String, required: true },
  link: { type: String, required: true },
  linkTitle: { type: String, required: true },
});

const FeaturedProductModel =
  models.FeaturedProduct || model("FeaturedProduct", featuredproductSchema);

export default FeaturedProductModel as Model<FeaturedProductDocument>;
