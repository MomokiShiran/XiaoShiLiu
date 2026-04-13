/**
 * 请求日志记录工具
 * 记录所有 HTTP 请求到文件
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

function createLogStream() {
  if (!config.log.enabled){
    return null;
  }

  const logDir = path.join(process.cwd(), config.log.dir);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const stream = fs.createWriteStream(path.join(logDir, 'request.log'), { flags: 'a' });

  stream.on('error', (err) => console.error('日志流错误：', err));
  process.on('SIGINT', () => stream.end());
  process.on('SIGTERM', () => stream.end());

  return stream;
}

const stream = createLogStream();

const requestLogger = (req, res, next) => {
  if (!stream) {
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
    stream.write(JSON.stringify(log) + '\n');
  });
  next();
};

module.exports = { requestLogger };