import { compare, genSalt, hash } from "bcrypt";
import { Schema, Document, model, models, Model } from "mongoose";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "socialLogin";
  avatar?: { url: string; id: string };
  verified: boolean;
  socialId?: string;
}

interface Method {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Method>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user", "socialLogin"],
      default: "user",
    },
    avatar: { type: Object, url: String, id: String },
    verified: { type: Boolean, default: false },
    socialId: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const UserModel = models.User || model("User", userSchema);
export default UserModel as Model<UserDocument, {}, Method>;
