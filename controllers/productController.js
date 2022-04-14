const express = require("express");
const cloudinary = require("../config/cloudinary");
const BigPromise = require("../middlewares/BigPromise");
const productModel = require("../models/Product");
const WhereClause = require("../utils/WhereClause");
exports.addProduct = BigPromise(async (req, res, next) => {
  let photos = [];

  if (!req.files) {
    return next(new Error("please upload photo"));
  }
  if (req.files) {
    for (let i = 0; i < req.files.photos.length; i++) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.files.photos[i].tempFilePath,
        {
          folder: "products",
        }
      );
      photos.push({ id: public_id, secure_url });
    }
  }
  req.body.photos = photos;
  req.body.user = req.user.id;
  const product = await productModel.create(req.body);
  res.status(200).send({
    success: true,
    product,
  });
});

exports.getAllProduct = BigPromise(async (req, res, next) => {
  let resultPerPage = 6;
  const totalNumberOfProduct = await productModel.countDocuments();

  const productObj = new WhereClause(productModel.find(), req.query)
    .search()
    .filter();
  let product = await productObj.base;
  const filteredProductCount = product.length;

  productObj.pager(resultPerPage);
  product = await productObj.base;

  res.status(200).json({
    success: true,
    product,
    filteredProductCount,
    totalNumberOfProduct,
  });
});
