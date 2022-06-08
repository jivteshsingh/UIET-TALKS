const express = require("express");
const { protect } = require("./authMiddleware");
const { sendNotification, fetchNotification, deleteNotification, deleteAll, groupDelete } = require("./notificationControllers")

const router = express.Router();

router.route('/').post(protect,sendNotification);
router.route('/').get(protect,fetchNotification);
router.route('/').delete(protect,deleteNotification);
router.route('/deleteall').delete(protect,deleteAll);
router.route('/deletegroup').delete(protect,groupDelete);

module.exports = router;
