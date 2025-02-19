const router = require("express").Router();

const { createOrder, getOrder } = require("../controllers/order");
const { requireLogin } = require("../middleware/middleware");

router.post("/create", requireLogin, createOrder);

router.post("/get", requireLogin, getOrder);

module.exports = router;
