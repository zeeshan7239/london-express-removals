const wrap = (body) => `
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f6fb;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0F172A 0%,#1e293b 100%);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;letter-spacing:-0.5px;">London Express Removals</h1>
          <p style="margin:8px 0 0;color:#cbd5e1;font-size:13px;">Trusted UK moving service</p>
        </td></tr>
        <tr><td style="padding:32px;">${body}</td></tr>
        <tr><td style="background:#0F172A;padding:24px;text-align:center;color:#94a3b8;font-size:12px;">
          © ${new Date().getFullYear()} London Express Removals · UK<br/>
          <a href="tel:+447459180023" style="color:#F97316;text-decoration:none;">Call us</a> ·
          <a href="mailto:bookings@londonexpressremovals.co.uk" style="color:#F97316;text-decoration:none;">Email</a>
        </td></tr>
      </table>
    </td></tr></table>
</body></html>`;

const row = (label, val) => val ? `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0F172A;font-size:14px;font-weight:500;">${val}</td>
  </tr>` : '';

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

export const quoteRequestCompanyTemplate = (q) => wrap(`
  <h2 style="margin:0 0 8px;font-size:20px;">${q.kind === 'booking' ? '🚚 New Booking' : '📋 New Custom Quote'}</h2>
  <p style="margin:0 0 24px;color:#64748b;font-size:14px;">
    ${q.kind === 'booking' ? 'A customer has booked through your online pricing system.' : 'A new customer has submitted a custom quote request.'}
  </p>
  <div style="background:#fff7ed;border-left:4px solid #F97316;padding:16px;border-radius:6px;margin-bottom:24px;">
    <strong style="color:#0F172A;">${q.customer.name}</strong><br/>
    <a href="tel:${q.customer.phone}" style="color:#F97316;text-decoration:none;">${q.customer.phone}</a> ·
    <a href="mailto:${q.customer.email}" style="color:#F97316;text-decoration:none;">${q.customer.email}</a>
  </div>
  ${q.estimatedPrice ? `
  <div style="background:linear-gradient(135deg,#0F172A,#1e293b);border-radius:10px;padding:16px;text-align:center;margin-bottom:24px;">
    <div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Estimated price</div>
    <div style="color:#F97316;font-size:28px;font-weight:800;">£${q.estimatedPrice}</div>
    ${q.durationHours ? `<div style="color:#94a3b8;font-size:11px;margin-top:4px;">${q.durationHours}h booking</div>` : ''}
  </div>` : ''}
  <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
    ${row('Moving Type', q.movingType)}
    ${row('Moving Date', formatDate(q.movingDate))}
    ${row('Movers Needed', q.moversNeeded)}
    ${q.durationHours ? row('Booking Duration', `${q.durationHours} hours`) : ''}
    ${row('Pickup', `${q.pickup.address || ''}${q.pickup.address ? '<br/>' : ''}${q.pickup.postcode}`)}
    ${row('Pickup Floor', `${q.pickup.floor || '—'}${q.pickup.access ? ' (' + q.pickup.access + ')' : ''}`)}
    ${row('Delivery', `${q.delivery.address || ''}${q.delivery.address ? '<br/>' : ''}${q.delivery.postcode}`)}
    ${row('Delivery Floor', `${q.delivery.floor || '—'}${q.delivery.access ? ' (' + q.delivery.access + ')' : ''}`)}
    ${q.distanceMiles ? row('Distance', `${q.distanceMiles.toFixed(1)} miles`) : ''}
    ${row('Notes', q.notes)}
  </table>
  <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:8px;font-size:13px;color:#475569;">
    Reply to this customer within 30 minutes to maximise booking conversion.
  </div>
`);

export const quoteConfirmationCustomerTemplate = (q) => wrap(`
  <h2 style="margin:0 0 8px;font-size:22px;">Thanks, ${q.customer.name.split(' ')[0]} 👋</h2>
  <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
    We've received your quote request and our team will get back to you within
    <strong style="color:#F97316;">30 minutes</strong> during business hours.
  </p>
  <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
    <h3 style="margin:0 0 12px;font-size:15px;color:#0F172A;">Your move summary</h3>
    <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
      ${row('Moving', q.movingType)}
      ${row('From', q.pickup.postcode)}
      ${row('To', q.delivery.postcode)}
      ${row('Date', formatDate(q.movingDate))}
      ${row('Movers', q.moversNeeded)}
    </table>
  </div>
  <div style="text-align:center;margin:32px 0 16px;">
    <a href="tel:${process.env.COMPANY_PHONE || '+447459180023'}"
       style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F97316,#fb923c);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
      Need to talk? Call us now
    </a>
  </div>
  <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;text-align:center;">
    Reference: ${q._id || 'pending'}
  </p>
`);

export const welcomeEmailTemplate = (user) => wrap(`
  <h2 style="margin:0 0 16px;font-size:22px;">Welcome, ${user.fullName.split(' ')[0]} 🎉</h2>
  <p style="color:#475569;font-size:15px;line-height:1.7;">
    Your account is ready. From your dashboard you can request quotes, track your bookings,
    and access exclusive customer discounts.
  </p>
  <div style="text-align:center;margin:24px 0;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || '#'}"
       style="display:inline-block;padding:14px 32px;background:#0F172A;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
      Visit site
    </a>
  </div>
`);

export const passwordResetTemplate = (user, resetUrl) => wrap(`
  <h2 style="margin:0 0 16px;font-size:22px;">Reset your password</h2>
  <p style="color:#475569;font-size:15px;line-height:1.7;">
    Hi ${user.fullName.split(' ')[0]}, we received a request to reset your password.
    Click the button below — the link expires in 30 minutes.
  </p>
  <div style="text-align:center;margin:32px 0;">
    <a href="${resetUrl}"
       style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F97316,#fb923c);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
      Reset password
    </a>
  </div>
  <p style="color:#94a3b8;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
`);

export const quoteAcceptedTemplate = (q, message, price) => wrap(`
  <div style="text-align:center;margin-bottom:24px;">
    <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:#dcfce7;line-height:64px;font-size:32px;">✅</div>
  </div>
  <h2 style="margin:0 0 12px;font-size:22px;text-align:center;">Great news, ${q.customer.name.split(' ')[0]}!</h2>
  <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;text-align:center;">
    We've reviewed your quote request and we're delighted to confirm your booking.
  </p>
  ${price ? `
  <div style="background:linear-gradient(135deg,#F97316,#fb923c);border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
    <div style="color:#ffedd5;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:6px;">Confirmed quote</div>
    <div style="color:#fff;font-size:36px;font-weight:800;font-family:-apple-system,sans-serif;">£${price}</div>
  </div>` : ''}
  ${message ? `
  <div style="background:#f8fafc;border-left:4px solid #F97316;padding:16px;border-radius:6px;margin-bottom:24px;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">A message from our team</div>
    <div style="color:#0F172A;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</div>
  </div>` : ''}
  <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
    <h3 style="margin:0 0 12px;font-size:14px;color:#0F172A;text-transform:uppercase;letter-spacing:1px;">Your move</h3>
    <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
      ${row('Type', q.movingType)}
      ${row('From', q.pickup.postcode)}
      ${row('To', q.delivery.postcode)}
      ${row('Date', formatDate(q.movingDate))}
      ${row('Movers', q.moversNeeded)}
    </table>
  </div>
  <p style="color:#475569;font-size:14px;line-height:1.7;text-align:center;">
    We'll be in touch shortly with the final logistics. Any questions?
    <a href="tel:${process.env.COMPANY_PHONE || '+447459180023'}" style="color:#F97316;font-weight:600;text-decoration:none;">Just give us a call</a>.
  </p>
  <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;text-align:center;">Reference: ${q._id}</p>
`);

export const quoteRejectedTemplate = (q, message) => wrap(`
  <h2 style="margin:0 0 12px;font-size:22px;">Hi ${q.customer.name.split(' ')[0]},</h2>
  <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
    Thank you for thinking of London Express Removals for your move.
    Unfortunately, we're not able to take on this booking at this time.
  </p>
  ${message ? `
  <div style="background:#f8fafc;border-left:4px solid #64748b;padding:16px;border-radius:6px;margin-bottom:24px;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">A note from us</div>
    <div style="color:#0F172A;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</div>
  </div>` : ''}
  <p style="color:#475569;font-size:15px;line-height:1.7;">
    If your dates are flexible or you'd like us to recommend a trusted alternative,
    please don't hesitate to <a href="tel:${process.env.COMPANY_PHONE || '+447459180023'}" style="color:#F97316;font-weight:600;text-decoration:none;">call us</a>.
  </p>
  <p style="color:#475569;font-size:14px;line-height:1.7;margin-top:24px;">
    With best wishes,<br/>
    <strong style="color:#0F172A;">The London Express Removals Team</strong>
  </p>
  <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;text-align:center;">Reference: ${q._id}</p>
`);
