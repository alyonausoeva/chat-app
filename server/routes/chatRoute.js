const { createChat, getUsersChats } = require("../controllers/chatController");

const express = require("express");
const router = express.Router();

router.post('/', createChat);
router.get('/:userId', getUsersChats);

module.exports = router;
