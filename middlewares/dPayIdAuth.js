const Bluebird = require('bluebird');
const dpayid = require('dpayid');

function createTimeout(timeout, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Request has timed out. It should take no longer than ${timeout}ms.`));
    }, timeout);
    promise.then(resolve, reject);
  });
}

async function authMiddleware(req, res, next) {
  const token = req.get('Authorization');
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const api = dpayid.Initialize({
      app: 'dsocial.dapp',
    });

    api.setAccessToken(token);

    const me = Bluebird.promisify(api.me, { context: api });

    const user = await createTimeout(10000, me());

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;

    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

module.exports = authMiddleware;
