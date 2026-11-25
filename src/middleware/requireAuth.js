function requireAuth(store) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const user = token ? store.sessions.get(token) : null;

    if (!user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    req.user = user;
    return next();
  };
}

module.exports = { requireAuth };
