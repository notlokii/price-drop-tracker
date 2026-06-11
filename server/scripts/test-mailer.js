import 'dotenv/config'
import { sendTestEmail } from '../src/services/mailer.js'

const to = process.argv[2]

if (!to) {
  console.error('Usage: npm run mail:test -- "you@example.com"')
  process.exit(1)
}

console.log(`Sending test email to: ${to}\n`)

try {
  await sendTestEmail(to)
  console.log('Test email sent successfully!')
} catch (err) {
  console.error('Failed to send test email:', err.message)
  process.exit(1)
}
