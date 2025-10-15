const decodeWithAtob = (input: string): string => {
  const binary = (globalThis.atob as (data: string) => string)(input)
  let output = ''
  for (let i = 0; i < binary.length; i++) {
    const code = binary.charCodeAt(i).toString(16).padStart(2, '0')
    output += '%' + code
  }
  try {
    return decodeURIComponent(output)
  } catch (error) {
    return decodeURIComponent(encodeURIComponent(binary))
  }
}

const base64UrlDecode = (input: string): string => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = 4 - (base64.length % 4)
  const padded = base64 + (padding < 4 ? '='.repeat(padding) : '')
  if (typeof globalThis.atob === 'function') {
    return decodeWithAtob(padded)
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf-8')
  }
  return ''
}

export const decodeJwtPayload = (token: string): Record<string, any> | null => {
  if (!token) {
    return null
  }
  const segments = token.split('.')
  if (segments.length < 2) {
    return null
  }
  try {
    const decoded = base64UrlDecode(segments[1])
    return decoded ? JSON.parse(decoded) : null
  } catch (error) {
    return null
  }
}

export const getRolesFromJwt = (token: string): string[] => {
  const payload = decodeJwtPayload(token)
  const role = payload && typeof payload.role === 'string' ? payload.role : ''
  return role
    .split(',')
    .map(item => item.trim())
    .filter(item => !!item)
}
