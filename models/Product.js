const { mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxLength: [120, "Product name should not be more then 120 character"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    trim: true,
    maxLength: [6, "Product name should not be more then 6 character"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description for a product"],
  },
  brand: {
    type: String,
    required: [true, "Please provide a brand"],
  },
  category: {
    type: String,
    required: [
      true,
      "Please select a category from - short-sleeves,long-sleeves,sweat-shirt,hoodies",
    ],
    enum: {
      values: ["shortsleeves", " longsleeves", "sweatshirt", "hoodies"],
      message:
        "Please select a category ONLY from - short-sleeves,long-sleeves,sweat-shirt,hoodies",
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  numOfRating: {
    type: Number,
    default: 0,
  },
  photos: [
    {
      id: { type: String, required: true },

      secure_url: { type: String, required: true },
    },
  ],
  review: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
    {
      name: {
        type: String,
        required: true,
      },
    },
    {
      message: {
        type: String,
        required: true,
      },
    },
    {
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  stock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Product", ProductSchema);
