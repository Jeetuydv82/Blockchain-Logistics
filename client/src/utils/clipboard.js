const copyToClipboard = (text, successMessage = 'Copied!') => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (window.__toast) window.__toast.success(successMessage)
      })
      .catch(() => fallbackCopy(text, successMessage))
  } else {
    fallbackCopy(text, successMessage)
  }
}

const fallbackCopy = (text, successMessage) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    document.execCommand('copy')
    if (window.__toast) window.__toast.success(successMessage)
  } catch (err) {
    if (window.__toast) window.__toast.error('Copy failed — please copy manually')
  }
  document.body.removeChild(textarea)
}

export default copyToClipboard
