const userMethods = require('../controllers/userController');
const chatMethods = require('../controllers/chatController');
const messageMethod = require('../controllers/messageController');

const rpcMethods = {
  ...userMethods,
  ...chatMethods,
  ...messageMethod
};

exports.jsonRpcHandler = async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  if (jsonrpc !== '2.0' || typeof method !== 'string' || typeof id === 'undefined') {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request' },
      id: null,
    });
  }

  const fn = rpcMethods[method];

  if (!fn || typeof fn !== 'function') {
    return res.status(404).json({
      jsonrpc: '2.0',
      error: { code: -32601, message: 'Method not found' },
      id,
    });
  }

  try {
    const result = await fn(params);
    return res.status(200).json({
      jsonrpc: '2.0',
      result,
      id,
    });
  } catch (err) {
    return res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: err.message,
      },
      id,
    });
  }
};