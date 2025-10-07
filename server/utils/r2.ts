import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_REGION = 'auto',
  R2_BUCKET,
  R2_PUBLIC_BASE_URL,
} = process.env

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  // Do not throw at import time in production server where code may be used without R2
  // Consumers should handle missing config and return clear errors
}

export const r2 = new S3Client({
  region: R2_REGION || 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
})

export function r2PublicUrl(key: string) {
  const trimmedKey = key.replace(/^\/+/, '')
  if (R2_PUBLIC_BASE_URL) {
    return `${R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${trimmedKey}`
  }
  // Default public URL pattern if bucket is made public via website/public domain mapping
  // Note: Without a public domain, direct object access may require signed URLs.
  return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${trimmedKey}`
}

export function keyFromPublicUrl(url: string | null | undefined) {
  if (!url) return null
  try {
    const u = new URL(url)
    if (R2_PUBLIC_BASE_URL && url.startsWith(R2_PUBLIC_BASE_URL)) {
      const base = R2_PUBLIC_BASE_URL.replace(/\/$/, '')
      return url.slice(base.length + 1)
    }
    // Fallback for https://<account>.r2.cloudflarestorage.com/<bucket>/<key>
    const parts = u.pathname.replace(/^\//, '').split('/')
    if (parts[0] === R2_BUCKET && parts.length > 1) {
      return parts.slice(1).join('/')
    }
  } catch (_) {
    // ignore
  }
  return null
}

export async function uploadBufferToR2(params: { key: string; buffer: Buffer; contentType?: string }) {
  if (!R2_BUCKET) throw new Error('R2_BUCKET is not configured')
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.contentType,
      ACL: undefined, // R2 ignores ACL, use bucket policy/public domain for access
    })
  )
  return r2PublicUrl(params.key)
}

export async function deleteR2ObjectByKey(key: string | null | undefined) {
  if (!key) return
  if (!R2_BUCKET) throw new Error('R2_BUCKET is not configured')
  await r2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
  )
}
