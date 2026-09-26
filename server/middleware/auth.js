// Auth stub owned by M2 (login/OTP).
// M2 will replace with real JWT verify. For now: attach req.user if Authorization present, else demo user.
export function protect(req, _res, next) {
  const h = req.headers.authorization || '';
  req.user = { id: h.replace('Bearer ', '') || 'demo-user', email: 'demo@stocksense.local' };
  next();
}
