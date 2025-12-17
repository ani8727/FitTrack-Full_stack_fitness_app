import React, { useEffect } from 'react'

const Toast = ({ type = 'success', message = '', onClose, timeout = 3000 }) => {
  useEffect(() => {
    if (!message) return
    const id = setTimeout(() => onClose && onClose(), timeout)
    return () => clearTimeout(id)
  }, [message, onClose, timeout])

  if (!message) return null

  const base = 'fixed bottom-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg border'
  const styles = type === 'error'
    ? `${base} bg-red-500/20 border-red-400/40 text-red-100`
    : `${base} bg-green-500/20 border-green-400/40 text-green-100`

  return (
    <div className={styles} role="status">
      <div className="text-sm font-medium">{message}</div>
    </div>
  )
}

export default Toast
