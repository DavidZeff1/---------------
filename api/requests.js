import { put, list, del } from '@vercel/blob'
import { notifyRecipients } from './_email.js'

const PREFIX = 'requests/'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return await getAll(res)
    if (req.method === 'POST') return await create(req, res)
    if (req.method === 'DELETE') return await remove(req, res)
    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('requests api error:', err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}

async function getAll(res) {
  const { blobs } = await list({ prefix: PREFIX })
  const records = await Promise.all(
    blobs
      .filter((b) => b.pathname.endsWith('.json'))
      .map(async (b) => {
        const r = await fetch(b.url)
        return r.json()
      }),
  )
  records.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  return res.status(200).json(records)
}

async function create(req, res) {
  const body = await readJson(req)
  const id = body.id || crypto.randomUUID()
  const createdAt = body.createdAt || new Date().toISOString()

  const attachments = []
  for (const a of body.attachments || []) {
    if (!a.base64) continue
    const buf = Buffer.from(a.base64, 'base64')
    const safeName = a.name.replace(/[^\w.\-]+/g, '_')
    const blob = await put(`${PREFIX}${id}/attachments/${safeName}`, buf, {
      access: 'public',
      contentType: a.type || 'application/octet-stream',
      addRandomSuffix: false,
    })
    attachments.push({ name: a.name, size: a.size, type: a.type, url: blob.url })
  }

  const record = {
    id,
    createdAt,
    status: body.status || 'new',
    fullName: body.fullName,
    title: body.title,
    department: body.department,
    email: body.email,
    phone: body.phone,
    preferredContact: body.preferredContact,
    recipient: body.recipient,
    type: body.type,
    erpFormType: body.erpFormType,
    urgency: body.urgency,
    subject: body.subject,
    body: body.body,
    caseNumber: body.caseNumber,
    attachments,
  }

  await put(`${PREFIX}${id}.json`, JSON.stringify(record), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })

  try {
    await notifyRecipients(record)
  } catch (e) {
    console.error('email notification failed:', e)
    // non-fatal: the record is saved even if email fails
  }

  return res.status(201).json(record)
}

async function remove(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const id = url.searchParams.get('id')
  if (!id) return res.status(400).json({ error: 'Missing id' })

  const { blobs } = await list({ prefix: `${PREFIX}${id}` })
  const main = await list({ prefix: `${PREFIX}${id}.json` })
  const urls = [...blobs, ...main.blobs].map((b) => b.url)
  if (urls.length) await del(urls)
  return res.status(204).end()
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body)
    let data = ''
    req.on('data', (c) => { data += c })
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
}
