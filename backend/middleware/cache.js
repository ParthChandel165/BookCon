const redisClient = require('../config/redisClient');

module.exports = function cache(keyBuilder, ttl = 60) {
  return async (req, res, next) => {
    const key = typeof keyBuilder === 'function' ? keyBuilder(req) : keyBuilder;

    try {
      const data = await redisClient.get(key);
      if (data) {
        return res.status(200).json(JSON.parse(data));
      }
      // Override res.send to cache after response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        redisClient.setEx(key, ttl, JSON.stringify(body));
        return originalJson(body);
      };
      next();
    } catch (err) {
      console.error('Redis Cache Error:', err);
      next(); // proceed anyway
    }
  };
};
