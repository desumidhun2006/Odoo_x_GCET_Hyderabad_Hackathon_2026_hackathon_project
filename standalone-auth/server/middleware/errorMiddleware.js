export function notFound(request, response) {
  response.status(404).json({ success: false, message: 'Endpoint not found' })
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error)
  if (error.code === 11000) {
    return response.status(409).json({ success: false, message: 'An account with that email already exists' })
  }
  if (error.name === 'ValidationError') {
    const firstError = Object.values(error.errors)[0]?.message
    return response.status(400).json({ success: false, message: firstError || 'Invalid request data' })
  }
  console.error('Request failed:', error.message)
  response.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode ? error.publicMessage : 'An unexpected error occurred',
  })
}