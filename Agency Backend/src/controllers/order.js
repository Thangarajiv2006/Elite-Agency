const order = require("../models/order");

exports.createOrder = async (req, res) => {
  for (let i = 0; i < req.body.orderedProducts.length; i++) {
    const element = req.body.orderedProducts[i];
    if (!element.quentity.trim()) {
      return res
        .status(200)
        .json({ errorCode: 99, errorMessage: "Pealse Fill Quentities" });
    }
  }

  if (req.body.orderedProducts.length == 0) {
    return res
      .status(200)
      .json({ errorCode: 99, errorMessage: "Pealse Fill Quentities" });
  }

  let product = [];
  for (let i = 0; i < req.body.orderedProducts.length; i++) {
    const element = req.body.orderedProducts[i];
    const data = {
      product: element.product,
      free: parseInt(element.free),
      quentity: parseInt(element.quentity),
      discount: parseInt(element.discount),
    };
    product.push(data);
  }
  const data = {
    orderedProducts: product,
    createdBy: req.agencyDetails._id,
    shop: req.body.shop,
    invoiceNo: Date.now(),
  };

  const createdOrder = await (
    await (await order.create(data)).populate("orderedProducts.product")
  )
    .populate("shop")
    .catch((err) => {
      console.log(err);
      return res
        .status(200)
        .json({ errorCode: 100, errorMessage: "Sorry Something went wrong!" });
    });
  res.status(201).json(createdOrder);
};

exports.getOrder = async (req, res) => {
  const { start, end } = req.body;

  const orderData = await order
    .find({ createdBy: req.agencyDetails._id })
    .sort({ createdAt: -1 })
    .skip(start)
    .limit(end)
    .populate("orderedProducts.product")
    .populate("shop")
    .catch(() => {
      res
        .status(100)
        .json({ errorCode: 100, errorMessage: "Sorry, Something Wrong!" });
    });

  res.status(200).json(orderData);
};
