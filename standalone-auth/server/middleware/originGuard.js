export function checkRequestOrigin(request, response, next) {
  const origin = request.get('Origin')
  const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173'
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(request.method)
  if (!safeMethod && origin && origin !== allowedOrigin) {
    return response.status(403).json({ success: false, message: 'Request origin is not allowed' })
  }
  next()
}