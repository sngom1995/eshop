import express from "express";
import Order from "../models/order.js";
const orderRouter = express.Router();

orderRouter.get("/", (req, res) => {
  const orderList = Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (orderList) {
    res.send(orderList);
  } else {
    res.status(500).json({ success: false, message: "No orders found" });
  }
});

orderRouter.get("/:id", (req, res) => {
  const order = Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
  if (order) {
    res.send(order);
  } else {
    res.status(500).json({ success: false, message: "No order found" });
  }
});

orderRouter.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const prices = totalPrices.reduce((a, b) => a + b, 0);

  const order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: prices,
    user: req.body.user,
  });
  order
    .save()
    .then((order) => {
      res.send(order);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

orderRouter.put("/:id", (req, res) => {
  Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  )
    .then((order) => {
      res.send(order);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

orderRouter.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then((order) => {
      if (order) {
        return res
          .status(200)
          .json({ success: true, message: "Order deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

orderRouter.get("/get/totalSales", (req, res) => {
  Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ])
    .then((order) => {
      res.send({ totalsales: order.pop().totalsales });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

export default orderRouter;
