import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: String, // hoặc ObjectId nếu bạn dùng chuẩn Mongo
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const CartSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true, // mỗi user chỉ có 1 cart
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);