import mongoose from "mongoose";

const { Schema } = mongoose;

const MakeSchema = new Schema(
  {
    label: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const virtual = MakeSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

MakeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Make = mongoose.model("Make", MakeSchema);

export default Make;