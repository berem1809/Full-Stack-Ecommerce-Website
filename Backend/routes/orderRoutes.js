const express = require("express");
const router = express.Router();
const { newOrder ,  getSingleOrder,myOrders , getAllOrders } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Admin Routes
router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles('admin'),getAllOrders);    


module.exports = router;