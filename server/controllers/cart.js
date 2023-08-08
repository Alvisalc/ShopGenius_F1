let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
// create a reference to the model
let Order = require("../models/order");
let Product = require("../models/product");
const { render } = require("ejs");

module.exports.displayCart = async (req, res, next) => {
  if (req.user) {
    const productList = [];
    await Order.findOne({ username: req.user.username })
      .then(async (order) => {
        // console.log(order.cart.lines[0].productId);
        // console.log(order.cart.lines[1].productId);

        for (const orderId of order.cart.lines) {
          //   console.log(orderId.productId);
          await Product.findById(orderId.productId).then((product) => {
            if (product) {
              //   console.log(product);
              productList.push(product);
            }
          });
        }
        // console.log(productList);
        res.render("cart", {
          title: "Shopping Cart",
          ProductList: productList,
          Cart: order.cart,
          displayName: req.user ? req.user.displayName : "",
          Role: req.user ? req.user.role : "",
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
  } else {
    res.redirect("/login");
  }

  //   if (req.user) {
  //     await Order.findOne({ username: req.user.username })
  //       .then((order) => {
  //         console.log(order);
  //         res.render("cart", {
  //           title: "Shopping Cart",
  //           Ord: order,
  //           displayName: req.user ? req.user.displayName : "",
  //           Role: req.user ? req.user.role : "",
  //         });
  //       })
  //       .catch((err) => {
  //         res.status(500).send({
  //           message: "Something went wrong!!",
  //           error: err,
  //         });
  //       });
  //   } else {
  //     res.redirect("/login");
  //   }
};

// module.exports.processAddToCart = async (req, res, next) => {
//   const newItem = new Order({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     talent: req.body.talent,
//     description: req.body.description,
//     service: req.body.service,
//     price: req.body.price,
//     remarks: req.body.remarks,
//     imageName: req.body.imageName,
//   });

//   await newItem
//     .save()
//     .then((data) => {
//       console.log(data);
//       // refresh the contact list
//       res.redirect("/product/?addSuccess=true");
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Something went wrong!!",
//         error: err,
//       });
//     });
// };

// module.exports.displayUpdatePage = async (req, res, next) => {
//   await Product.findById(req.params.id)
//     .then((productToUpdate) => {
//       console.log(productToUpdate);
//       res.render("product_update", {
//         title: "Update Product",
//         ProductList: productToUpdate,
//         displayName: req.user ? req.user.displayName : "",
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Something went wrong!!",
//         error: err,
//       });
//     });
// };

module.exports.processUpdateCart = async (req, res, next) => {
  if (req.user) {
    const addId = req.params.id;
    let price;
    // retrieve product price
    await Product.findById(req.params.id)
      .then((product) => {
        price = product.price;
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });

    console.log("Processing add to cart ========= " + addId);
    await Order.findOneAndUpdate(
      {
        username: req.user.username,
        "cart.lines": { $not: { $elemMatch: { productId: addId } } },
      },
      {
        $push: { "cart.lines": { productId: addId, quantity: 1 } }, // Push the new object to lines array
        $inc: { "cart.itemCount": 1, "cart.cartPrice": price },
      },
      { new: true }
    )
      .then(async (updatedOrder) => {
        console.log("order: " + updatedOrder);
        if (!updatedOrder) {
          console.log("Product already exists ========= " + addId);
          await Order.findOneAndUpdate(
            {
              username: req.user.username,
              "cart.lines.productId": req.params.id,
            },
            {
              $inc: {
                "cart.itemCount": 1,
                "cart.cartPrice": price,
                "cart.lines.$.quantity": 1,
              },
            },
            { new: true }
          ).then((updatedOrder) => {
            console.log("order: " + updatedOrder);
            res.redirect("/cart?addToCartSuccess=true")
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
    //   .then(async (updatedOrder) => {
    //     // console.log(order.cart.lines[0].productId);
    //     // console.log(order.cart.lines[1].productId);
    //     // console.log(productList);
    //     res.render("cart", {
    //       title: "Shopping Cart",
    //       ProductList: productList,
    //       Cart: order.cart,
    //       displayName: req.user ? req.user.displayName : "",
    //       Role: req.user ? req.user.role : "",
    //     });
    //   })
    //   .catch((err) => {
    //     res.status(500).send({
    //       message: "Something went wrong!!",
    //       error: err,
    //     });
    //   });

    // await Order.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     talent: req.body.talent,
    //     description: req.body.description,
    //     service: req.body.service,
    //     price: req.body.price,
    //     remarks: req.body.remarks,
    //     imageName: req.body.imageName,
    //   },
    //   { new: true }
    // )
    //   .then((product) => {
    //     res.redirect("/product?updateSuccess=true");
    //   })
    //   .catch((err) => {
    //     res.status(500).send({
    //       message: "Something went wrong!!",
    //       error: err,
    //     });
    //   });
  } else {
    res.redirect("/login");
  }
};

module.exports.performDelete = async (req, res, next) => {
  let qty;
  let perPrice;
  let subTotPrice;
  console.log("Start deleting ========= " + req.params.id);

  await Product.findById(req.params.id)
    .then((product) => {
      perPrice = product.price;
      // console.log("=======Price: " + perPrice);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Something went wrong!!",
        error: err,
      });
    });

  await Order.findOne({ username: req.user.username })
    .then((order) => {
      const linesObject = order.cart.lines.find(
        (line) => line.productId === req.params.id
      );
      qty = linesObject.quantity;
      // console.log("=======qty: " + qty);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Something went wrong!!",
        error: err,
      });
    });

  subTotPrice = qty * perPrice;
  // console.log("=======subTotPrice: " + subTotPrice);

  Order.findOneAndUpdate(
    {
      username: req.user.username,
      "cart.lines.productId": req.params.id,
    },
    {
      $pull: { "cart.lines": { productId: req.params.id } },
      $inc: { "cart.cartPrice": -subTotPrice, "cart.itemCount": -qty }, // Subtract quantity from itemCount
    },
    { new: true }
  )
    .then((order) => {
      // console.log(order);
      res.redirect("/cart");
    })
    .catch((err) => {
      res.status(500).send({
        message: "Something went wrong!!",
        error: err,
      });
    });
};
