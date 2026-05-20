import twilio from 'twilio';

let client = globalThis.twilioClient;

const getClient = () => {
  if (client) return client;
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return null;
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  globalThis.twilioClient = client;
  return client;
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric'
});

const buildCompanyMessage = (q) => `🚚 *New ${q.kind === 'booking' ? 'Booking' : 'Quote Request'}*

👤 *${q.customer.name}*
📞 ${q.customer.phone}
✉️ ${q.customer.email}

📦 *Move type:* ${q.movingType}
📍 *From:* ${q.pickup.postcode} (${q.pickup.floor || '—'})
🏁 *To:* ${q.delivery.postcode} (${q.delivery.floor || '—'})
📅 *Date:* ${formatDate(q.movingDate)}
👷 *Movers:* ${q.moversNeeded}
${q.estimatedPrice ? `💷 *Estimated:* £${q.estimatedPrice}\n` : ''}${q.notes ? `📝 *Notes:* ${q.notes}\n` : ''}
Ref: ${q._id}`;

export const sendWhatsAppNotification = async (quote) => {
  const c = getClient();
  if (!c) {
    console.log('⚠️  Twilio not configured — WhatsApp notification skipped');
    return null;
  }
  try {
    const msg = await c.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.COMPANY_WHATSAPP,
      body: buildCompanyMessage(quote),
    });
    console.log(`📱 WhatsApp sent: ${msg.sid}`);
    return msg;
  } catch (err) {
    console.error('❌ WhatsApp error:', err.message);
    return null;
  }
};

export const sendCustomerConfirmationWhatsApp = async (quote, price) => {
  const c = getClient();
  if (!c) return null;

  // Format the customer phone for WhatsApp (E.164)
  let phone = quote.customer.phone.replace(/\D/g, '');
  if (phone.startsWith('0')) phone = '44' + phone.slice(1);
  if (!phone.startsWith('+')) phone = '+' + phone;

  const body = `Hi ${quote.customer.name.split(' ')[0]} 👋

✅ Your move with *London Express Removals* is confirmed!

📦 ${quote.movingType}
📅 ${formatDate(quote.movingDate)}
📍 ${quote.pickup.postcode} → ${quote.delivery.postcode}
${price ? `💷 *£${price}*\n` : ''}
We'll be in touch soon with final logistics.

Ref: ${quote._id}`;

  try {
    const msg = await c.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${phone}`,
      body,
    });
    console.log(`📱 Customer WhatsApp sent: ${msg.sid}`);
    return msg;
  } catch (err) {
    console.error('❌ Customer WhatsApp error:', err.message);
    return null;
  }
};
