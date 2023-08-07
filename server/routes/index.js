let express = require("express");
let router = express.Router();

let indexController = require("../controllers/index");

/* GET home page. */
router.get("/", indexController.displayHomePage);

/* GET home page. */
router.get("/home", indexController.displayHomePage);

/* GET Services page. */
router.get("/services", indexController.displayServicesPage);

/* GET Contact Us page. */
router.get("/contact", indexController.displayContactPage);

/* GET Route for displaying Login page */
router.get("/login", indexController.displayLoginPage);

/* POST Route for processing Login page */
router.post("/login", indexController.processLoginPage);

/* GET Route for displaying Register page */
router.get("/register", indexController.displayRegisterPage);

/* POST Route for processing Register page */
router.post("/register", indexController.processRegisterPage);

/* GET to perform UserLogout */
router.get("/logout", indexController.performLogout);

module.exports = router;
