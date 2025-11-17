import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export function generateApiKey(): { key: string; hash: string; prefix: string } {
  // Generate random bytes for the key
  const randomBytes = crypto.randomBytes(32)
  const keyToken = randomBytes.toString('hex')
  
  // Create the full key with prefix
  const fullKey = `sr_live_${keyToken}`
  
  // Create hash for storage
  const hash = bcrypt.hashSync(fullKey, 10)
  
  // Create prefix for display (first 16 chars)
  const prefix = fullKey.substring(0, 16)
  
  return {
    key: fullKey,
    hash,
    prefix,
  }
}

export function verifyApiKey(key: string, hash: string): boolean {
  // Use bcrypt compare for validation
  return bcrypt.compareSync(key, hash)
}

