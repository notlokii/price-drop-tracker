import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL =
  process.env.ALERT_FROM_EMAIL || 'PriceDrop <onboarding@resend.dev>'

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`
}

export async function sendPriceDropEmail({
  to,
  productName,
  oldPrice,
  newPrice,
  productUrl,
}) {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not set in .env')
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Price drop: ${productName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6366f1;">PriceDrop Alert</h2>
        <p>Good news — a product you're tracking hit your target price!</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px; font-weight: bold; font-size: 18px;">${productName}</p>
          <p style="margin: 0 0 4px;">Was: <s>${formatPrice(oldPrice)}</s></p>
          <p style="margin: 0 0 4px; color: #16a34a; font-weight: bold;">Now: ${formatPrice(newPrice)}</p>
        </div>
        <a href="${productUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
          View Product
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
          You're receiving this because you're tracking this item on PriceDrop.
        </p>
      </div>
    `,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function sendTestEmail(to) {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not set in .env')
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'PriceDrop — test email',
    html: '<p>If you received this, Resend is configured correctly.</p>',
  })

  if (error) {
    throw new Error(error.message)
  }
}
