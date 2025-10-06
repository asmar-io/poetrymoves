/**
 *
 * @param {string} email
 * @returns {boolean}
 */
export function checkEmail(email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
}

/**
 *
 * @param {string} password
 * @returns { string }
 */
export function checkPassword(password) {
  if (password === '') return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'

  return ''
}
