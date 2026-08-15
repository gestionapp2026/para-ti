const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Prohibido' });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
}

function checkGirlfriendCode(req, res, next) {
  const requiredCode = process.env.GF_ACCESS_CODE;
  if (!requiredCode) {
    // Si no se configuro codigo, la vista queda abierta
    return next();
  }

  const providedCode = req.headers['x-gf-code'];
  if (providedCode !== requiredCode) {
    return res.status(401).json({ error: 'Codigo de acceso invalido' });
  }

  next();
}

module.exports = { requireAdmin, checkGirlfriendCode };
