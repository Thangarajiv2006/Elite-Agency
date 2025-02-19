const router = require("express").Router();
const { createCategory, getAllCategory } = require("../controllers/category");
const { requireLogin } = require("../middleware/middleware");
const upload = require("../utils/multer");

router.post("/create", requireLogin, upload.single("photo"), createCategory);
router.get("/get", requireLogin, getAllCategory);

module.exports = router;
