const crypto = require('crypto');
const key = `neur_${crypto.randomBytes(16).toString('hex')}`;
console.log(`API key: ${key}`);
