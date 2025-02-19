const worker = require("../models/worker");
const bcrypt = require("bcrypt");

exports.createWorker = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  let photo;

  if (req.file && req.file.filename) {
    photo = req.file.filename;
  }

  if (
    name.trim() &&
    email.trim() &&
    password.trim() &&
    mobile.trim() &&
    photo
  ) {
    const workerExist = await worker
      .findOne({ email })
      .catch(() =>
        res
          .status(200)
          .json({ errorCode: 100, errorMessage: "Sorry Something wrong!" })
      );

    if (!workerExist) {
      const encryptedPassword = await bcrypt.hash(password, 5);
      const data = {
        email,
        name,
        password: encryptedPassword,
        mobile,
        photo,
        createdBy: req.agencyDetails._id,
      };
      await worker
        .create(data)
        .then((createdData) => {
          res.status(201).json(createdData);
        })
        .catch(() => {
          res
            .status(200)
            .json({ errorCode: 100, errorMessage: "Sorry Something wrong!" });
        });
    } else {
      res
        .status(200)
        .json({ errorCode: 101, errorMessage: "Worker Aldready Exist!" });
    }
  } else {
    res
      .status(200)
      .json({ errorCode: 99, errorMessage: "Fill all the inputs!" });
  }
};

exports.getWorker = async (req, res) => {
  const { start } = req.body;

  const workerData = await worker
    .find({ createdBy: req.agencyDetails._id })
    .sort({ createdAt: -1 })
    .skip(start)
    .limit(10)
    .catch(() => {
      res
        .status(100)
        .json({ errorCode: 100, errorMessage: "Sorry, Something Wrong!" });
    });

  res.status(200).json(workerData);
};

exports.deactive = async (req, res) => {
  const { workerId, isWorked } = req.body;
  if (workerId) {
    await worker
      .findByIdAndUpdate(
        workerId,
        { $set: { isWorked: !isWorked } },
        { new: true }
      )
      .then(() => {
        res.sendStatus(201);
      })
      .catch(() => {
        res
          .status(200)
          .json({ errorCode: 103, errorMessage: "User Does not Exist!" });
      });
  } else {
    res
      .status(200)
      .json({ errorCode: 103, errorMessage: "Something went wrong!" });
  }
};
