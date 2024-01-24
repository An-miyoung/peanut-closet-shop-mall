import { Model, ObjectId, Schema, model, models } from "mongoose";
import startDb from "@lib/db";

interface HistoryDocuments extends Document {
  owner: ObjectId;
  items: { product: ObjectId; date: Date }[];
}

const historySchema = new Schema<HistoryDocuments>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      date: { type: Date, default: Date.now() },
    },
  ],
});

export const updateOrCreateHistory = async (
  ownerId: string,
  productId: string
) => {
  await startDb();
  const history = await HistoryModel.findOneAndUpdate(
    { owner: ownerId, "items.product": productId },
    {
      // 기존 사용자 - 기존 히스토리에 같은 상품 업데이트, $ 는 찾아낸 그 history 의 인덱스를 주는 기호
      $set: { "items.$.date": Date.now() },
    }
  );
  if (!history) {
    // 기존 사용자 - 기존 히스토이에 새로운 상품 업데이트
    await HistoryModel.findOneAndUpdate(
      { owner: ownerId },
      {
        // object 속 한가지만 바꿀때 $set, 새로운 object 를 하나 넣으면 $push
        $push: { items: { product: productId, date: Date.now() } },
      },
      // 새로운 사용자 - 새로운 히스토리
      { upsert: true }
    );
  }
};

const HistoryModel = models.History || model("History", historySchema);

export default HistoryModel as Model<HistoryDocuments>;
