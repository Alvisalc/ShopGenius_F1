let mongoose = require("mongoose");

// create order model class
let Order = mongoose.Schema(
  {
    username: String,
    name: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
    shipped: Boolean,
    cart: {
      lines: [
        {
          productId: String,
          quantity: Number,
        },
      ],
      itemCount: Number,
      cartPrice: Number,
    },
  },
  {
    collection: "orders",
  }
);

module.exports = mongoose.model("Order", Order);
