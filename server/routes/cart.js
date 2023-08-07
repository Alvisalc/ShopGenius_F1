let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let cartController = require("../controllers/cart");
let passport = require("passport");

// helper function for guard purposes
// function requireAuth(req, res, next) {
//     // check if the user is logged in
//     if (!req.isAuthenticated()) {
//         return res.redirect('/login')
//     }
//     next();
// }
/* The following part has "/product" omitted, ie /product/:id --> /:id*/
/* GET Route for the Product List page  - READ Operation*/
router.get("/", cartController.displayCart);

// /* GET Route for the Individual Product page  - READ Operation*/
// router.get('/individual/:id', productController.displayIndividualProduct)

// /* GET Route for displaying Add page  - CREATE Operation*/
// router.get('/add', requireAuth, productController.displayAddPage)

// /* POST Route for processing Add page  - CREATE Operation*/
// router.post('/add', requireAuth, productController.processAddPage)

// /* GET Route for displaying Update page  - UPDATE Operation*/
// router.get('/update/:id', requireAuth, productController.displayUpdatePage)

/* PUT Route for processing Update Cart   - UPDATE Operation*/
router.post("/update/:id", cartController.processUpdateCart);

// /* GET to perform Deletion  - DELETE Operation*/
// router.get('/delete/:id', requireAuth, productController.performDelete)

module.exports = router;
