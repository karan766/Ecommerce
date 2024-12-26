import mongoose from "mongoose";

const { Schema } = mongoose;    

const OrderSchema = new Schema({
    items: { type: [Schema.Types.Mixed] ,require:true},
    totalAmount: { type: Number},
    totalItems: { type: Number},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "pending" },
    paymentMethod: { type: String, required: true },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
    Paymentstatus: { type: String, default: "unpaid" },
} , { timestamps: true });
 
const virtual = OrderSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

OrderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});


const Order = mongoose.model("Order", OrderSchema);

export default Order;