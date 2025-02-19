const router = require("express").Router();
const { createWorker, getWorker, deactive } = require("../controllers/worker");
const { requireLogin } = require("../middleware/middleware");
const upload = require("../utils/multer");

router.post("/create", requireLogin, upload.single("photo"), createWorker);
router.post("/get", requireLogin, getWorker);
router.put("/deactive", requireLogin, deactive);

module.exports = router;
