import React, { useEffect, useMemo, useState } from 'react'
import emailjs from '@emailjs/browser'
import { FiX } from 'react-icons/fi'
import { sendContactMessage } from '../../services/api'

const DEFAULT_FORM = {
  name: '',
  email: '',
  reason: 'General',
  message: ''
}

const ContactModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success'|'error', message: string }

  const canSubmit = useMemo(() => {
    const nameOk = form.name.trim().length >= 2
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    const messageLen = form.message.trim().length
    const messageOk = messageLen >= 10 // backend requires @Size min 10
    return nameOk && emailOk && messageOk && !submitting
  }, [form, submitting])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    setStatus(null)
  }, [isOpen])

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const resetAndClose = () => {
    setForm(DEFAULT_FORM)
    setStatus(null)
    onClose?.()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    try {
      setSubmitting(true)
      setStatus(null)
      // Send emails via EmailJS (admin + user confirmation)
      const templateParams = {
        user_name: form.name.trim(),
        user_email: form.email.trim(),
        reason: form.reason,
        message: form.message.trim(),
        admin_email: 'aniketgupta.8727@gmail.com',
        timestamp: new Date().toLocaleString()
      }
      await Promise.all([
        emailjs.send('fitness_app', 'template_hpm27gd', templateParams, 'NXoVXoETzx_Thvzn1'),
        emailjs.send('fitness_app', 'template_had0n98', templateParams, 'NXoVXoETzx_Thvzn1')
      ])

      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        reason: form.reason,
        message: form.message.trim()
      })
      setStatus({ type: 'success', message: 'Message sent. Thanks — we’ll get back to you soon.' })
      setTimeout(() => resetAndClose(), 800)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not send message. Please try again.'
      setStatus({ type: 'error', message: msg })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-[60]"
        onClick={resetAndClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Contact"
      >
        <div className="card w-full max-w-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
            <div>
              <div className="text-lg font-semibold text-[var(--color-text)]">Contact</div>
              <div className="text-sm text-[var(--color-text-muted)]">Send a quick message</div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--color-surface-muted)70%,var(--color-surface))] dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Name</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
                <input
                  className="input-field"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Reason</label>
              <select className="input-field" value={form.reason} onChange={update('reason')}>
                <option value="General">General</option>
                <option value="Bug">Bug / Issue</option>
                <option value="Feature">Feature Request</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Message</label>
              <textarea
                className="input-field"
                rows={4}
                value={form.message}
                onChange={update('message')}
                placeholder="Write your message..."
                minLength={10}
              />
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                Minimum 10 characters (required). {Math.max(0, 10 - form.message.trim().length)} more to go.
              </div>
            </div>

            {status && (
              <div
                className={`text-sm rounded-lg px-3 py-2 border ${
                  status.type === 'success'
                    ? 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-danger-700 dark:text-danger-300 border-danger-200 dark:border-danger-900/40 bg-danger-50 dark:bg-danger-900/20'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={resetAndClose} className="btn-outline" disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!canSubmit}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ContactModal
