const router = require("express").Router();
const controller = require("../controllers/inventoryController");
const auth = require("../middleware/authMiddleware");
const {
  inventoryValidation,
  validate,
} = require("../middleware/validationMiddleware");

router.use(auth);

router.get("/", controller.getItems);
router.get("/:id", controller.getItemById);

router.post("/", inventoryValidation, validate, controller.createItem);
router.put("/:id", inventoryValidation, validate, controller.updateItem);
router.delete("/:id", controller.deleteItem);

module.exports = router;
