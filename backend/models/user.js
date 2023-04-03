import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  street: { type: String, default: "" },
  apartment: { type: String, default: "" },
  zip: { type: String, default: "" },
  city: { type: String, default: "" },
  country: { type: String, default: "" },
  dateCreated: { type: Date, default: Date.now },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});

export const User = mongoose.model("User", userSchema);
