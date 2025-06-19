const { createMessage, getMessages, getLastMessage } = require("../controllers/messageController")

const express = require("express");
const router = express.Router();

router.post('/', createMessage);
router.get('/:chatId', getMessages);
router.get('/:chatId/last', getLastMessage);

module.exports = router;
