const category = require("../models/category");

exports.createCategory = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  if (req.body.name && req.file.filename) {
    if (await category.findOne({ name: req.body.name })) {
      return res.status(200).json({
        errorCode: 110,
        errorMessage: `"${req.body.name}" is aldready exist`,
      });
    }
    await category
      .create({
        name: req.body.name,
        pic: req.file.filename,
        createdBy: req.agencyDetails._id,
      })
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((e) => {
        console.log(e.message);
        res.status(200).json({
          errorCode: 100,
          errorMessage: "Sorry, somethhing wrong!",
        });
      });
  } else {
    res
      .status(200)
      .json({ errorCode: 99, errorMessage: "Fill all the required fields" });
  }
};

exports.getAllCategory = async (req, res) => {
  await category
    .find({ createdBy: req.agencyDetails._id })
    .then((data) => res.status(201).json(data))
    .catch(() =>
      res
        .status(200)
        .json({ errorCode: 100, errorMessage: "Sorry, somethhing wrong!" })
    );
};
