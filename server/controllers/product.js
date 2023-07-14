let express = require('express')
let router = express.Router();
let mongoose = require('mongoose')

let jwt = require('jsonwebtoken')

// create a reference to the model
let Product = require('../models/product');

module.exports.displayProductList = async (req, res, next) => {
    await Product.find()
              .then((products) => {
                console.log(products);
                  res.render('product', {title: 'Geniuses', ProductList: products, displayName: req.user ? req.user.displayName : ''})
              })
              .catch((err) => {
                res.status(500).send({
                  message: "Something went wrong!!",
                  error: err,
                });
              });
}

module.exports.displayAddPage = async (req, res, next) => {
    // console.log(req.user)
    res.render('product_add', {title: 'Add Product', displayName: req.user ? req.user.displayName : ''})
}

module.exports.processAddPage = async (req, res, next) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.talent || !req.body.description || !req.body.service || !req.body.price) {
      return res.status(400).send({
        message: "Please enter all necessary information",
      });
    }
  
    const newProduct = new Product({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      talent: req.body.talent,
      description: req.body.description,
      service: req.body.service,
      price: req.body.price,
      remarks: req.body.remarks,
      imageName: req.body.imageName
    });
  
    await newProduct.save()
              .then((data) => {
                console.log(data)
                // refresh the contact list
                res.redirect('/product')
              }
                )
              .catch((err) => {
                res.status(500).send({
                  message: "Something went wrong!!",
                  error: err,
                });
              });
}

module.exports.displayUpdatePage = async (req, res, next) => {

    await Product.findById(req.params.id)
    .then((productToUpdate) => {
      console.log(productToUpdate);
      res.render('product_update', {title: 'Update Product', ProductList: productToUpdate, displayName: req.user ? req.user.displayName : ''})
    })
    .catch((err) => {
      res.status(500).send({
        message: "Something went wrong!!",
        error: err,
      });
    });
}

module.exports.processUpdatePage = async (req, res, next) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.talent || !req.body.description || !req.body.service || !req.body.price) {
        return res.status(400).send({
          message: "Please enter all necessary information",
        });
    }
  
    await Product.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        talent: req.body.talent,
        description: req.body.description,
        service: req.body.service,
        price: req.body.price,
        remarks: req.body.remarks,
        imageName: req.body.imageName
      },
      { new: true }
    )
      .then((updatedProduct) => {
        console.log(updatedProduct)
        res.redirect('/product')
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
}

module.exports.performDelete = async (req, res, next) => {
    await Product.findByIdAndRemove(req.params.id)
      .then((productToDelete) => {
        res.redirect('/product');
        console.log("ID: " + productToDelete._id + " got deleted!!")
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
}