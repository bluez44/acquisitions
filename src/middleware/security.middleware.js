import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  console.log('Security middleware invoked');
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 10;
        message = 'Admin rate limit exceeded';
        break;
      case 'user':
        limit = 5;
        message = 'User rate limit exceeded';
        break;
      default:
        limit = 5;
        message = 'Guest rate limit exceeded';
    }
    console.log(`Applying rate limit: ${limit} requests per minute for role: ${role}`);
    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
      })
    );

    const decision = await client.protect(req);

    console.log(`Arcjet decision: ${decision.conclusion} | reason: ${JSON.stringify(decision.reason)} | ip: ${req.ip}`);

    logger.debug(`Arcjet decision: ${decision.conclusion} | reason: ${JSON.stringify(decision.reason)} | ip: ${req.ip}`);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn(
        `Bot detected: ${decision.reason.botCategory || 'Unknown bot'} - ${req.ip}`
      );

      return res.status(403).send('Access denied: Bot detected');
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn(
        `Shield triggered: ${decision.reason.shieldRule || 'Unknown rule'} - ${req.ip}`
      );
      return res
        .status(403)
        .send('Access denied: Suspicious activity detected');
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn(`Rate limit exceeded: ${message} - ${req.ip}`);
      return res.status(429).send(message);
    }

    next();
  } catch (error) {
    console.error('Arcjet error:', error);
    res.status(500).send('Arcjet error');
  }
};

export default securityMiddleware;
