/**
 * 请求日志记录工具
 * 记录所有 HTTP 请求到文件
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const logDir = path.join(process.cwd(), config.log.dir);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const requestLogger = (req, res, next) => {
  if (!config.log.enabled) {
    return next();
  }
  const start = Date.now();
  res.on('finish', () => {
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      statusCode: res.statusCode,
      responseTime: `${Date.now() - start}ms`
    };
    fs.appendFileSync(path.join(logDir, 'request.log'), JSON.stringify(log) + '\n');
  });
  next();
};

module.exports = { requestLogger };