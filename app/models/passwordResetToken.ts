import { compare, genSalt, hash } from "bcrypt";
import { Schema, Document, model, models, Model, ObjectId } from "mongoose";

interface PasswordResetTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface Method {
  compareToken(token: string): Promise<boolean>;
}

const passwordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
  {},
  Method
>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
    expires: 60 * 60 * 24, //24시간동안만 유효한 토큰
  },
});

passwordResetTokenSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("token")) return next();

    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
    next();
  } catch (error: any) {
    throw new Error(error.message);
  }
});

passwordResetTokenSchema.methods.compareToken = async function (
  tokenToCompare
) {
  try {
    return await compare(tokenToCompare, this.token);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const PasswordResetToken =
  models.PasswordResetToken ||
  model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken as Model<
  PasswordResetTokenDocument,
  {},
  Method
>;
