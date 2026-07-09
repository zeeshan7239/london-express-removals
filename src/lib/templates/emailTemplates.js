// ── Layout wrapper ────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const row = (label, val) => val || val === 0 ? `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0F172A;font-size:14px;font-weight:500;">${val}</td>
  </tr>` : '';

const sectionHeading = (title) => `
  <div style="margin:24px 0 8px;padding:8px 12px;background:#f1f5f9;border-radius:6px;color:#0F172A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${title}</div>`;

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

const formatTime12h = (t24) => {
  if (!t24) return '';
  const [h, m] = String(t24).split(':').map(Number);
  if (isNaN(h)) return t24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, '0')}:${String(m || 0).padStart(2, '0')} ${period}`;
};

// Renders one location as "Address<br/>Postcode · Floor · Access"
const locationLine = (loc) => {
  if (!loc || !loc.postcode) return '';
  const parts = [];
  if (loc.address) parts.push(loc.address);
  parts.push(loc.postcode);
  const meta = [];
  if (loc.floor) meta.push(loc.floor);
  if (loc.access) meta.push(loc.access);
  if (meta.length) parts.push(`<span style="color:#64748b;font-size:12px;">${meta.join(' · ')}</span>`);
  return parts.join('<br/>');
};

// Renders the intermediate stops table (empty string if none)
const stopsRows = (stops = []) => {
  if (!stops.length) return '';
  return stops.map((s, i) => row(`Stop ${i + 1}`, locationLine(s))).join('');
};

// Renders packing material lines (only ones with a positive quantity)
const packingLines = (pm) => {
  if (!pm || !pm.requested) return '';
  const items = [];
  if (pm.smallBoxes      > 0) items.push(row('Small Boxes',      pm.smallBoxes));
  if (pm.mediumBoxes     > 0) items.push(row('Medium Boxes',     pm.mediumBoxes));
  if (pm.largeBoxes      > 0) items.push(row('Large Boxes',      pm.largeBoxes));
  if (pm.bubbleWrapRolls > 0) items.push(row('Bubble Wrap Rolls',pm.bubbleWrapRolls));
  if (pm.tapeRolls       > 0) items.push(row('Packing Tape Rolls', pm.tapeRolls));
  if (!items.length) return '';
  return sectionHeading('Packing Materials') + `
    <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
      ${items.join('')}
      ${pm.total ? row('Packing subtotal', `£${pm.total}`) : ''}
    </table>`;
};

// Renders property details (only if any are set)
const propertyDetailsBlock = (pd) => {
  if (!pd) return '';
  const rows = [];
  if (pd.bedrooms)      rows.push(row('Bedrooms', pd.bedrooms));
  if (pd.numBeds > 0)   rows.push(row('Beds', pd.numBeds));
  if (pd.numSofas > 0)  rows.push(row('Sofas', pd.numSofas));
  if (pd.numLargeItems > 0) rows.push(row('Large furniture items', pd.numLargeItems));
  if (pd.dismantling)   rows.push(row('Dismantling', 'Required'));
  if (pd.reassembly)    rows.push(row('Reassembly', 'Required'));
  if (!rows.length) return '';
  return sectionHeading('Property & Furniture') + `
    <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
      ${rows.join('')}
    </table>`;
};

// Parking block
const parkingBlock = (pd) => {
  if (!pd?.parkingAvailable) return '';
  const isYes = pd.parkingAvailable === 'yes';
  return sectionHeading('Parking') + `
    <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
      ${row('Parking available', isYes ? 'Yes' : 'No')}
    </table>
    ${!isYes ? `
      <div style="margin-top:8px;padding:12px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px;color:#78350f;font-size:12px;">
        Customer noted that parking is <strong>not available</strong>.
        Additional waiting charges may apply if parking is unavailable on the day of the move.
      </div>` : ''}`;
};

// ── Company / admin template ─────────────────────────────────────────────────
export const quoteRequestCompanyTemplate = (q) => wrap(`
  <h2 style="margin:0 0 8px;font-size:20px;">${q.kind === 'booking' ? '🚚 New Booking' : '📋 New Custom Quote'}</h2>
  <p style="margin:0 0 24px;color:#64748b;font-size:14px;">
    ${q.kind === 'booking' ? 'A customer has booked through your online pricing system.' : 'A new customer has submitted a custom quote request.'}
  </p>

  <div style="background:#fff7ed;border-left:4px solid #F97316;padding:16px;border-radius:6px;margin-bottom:24px;">
    <strong style="color:#0F172A;font-size:15px;">${q.customer.name}</strong><br/>
    <a href="tel:${q.customer.phone}" style="color:#F97316;text-decoration:none;">${q.customer.phone}</a> ·
    <a href="mailto:${q.customer.email}" style="color:#F97316;text-decoration:none;">${q.customer.email}</a>
  </div>

  ${q.estimatedPrice ? `
  <div style="background:linear-gradient(135deg,#0F172A,#1e293b);border-radius:10px;padding:16px;text-align:center;margin-bottom:24px;">
    <div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Estimated total</div>
    <div style="color:#F97316;font-size:28px;font-weight:800;">£${q.estimatedPrice}</div>
    ${q.durationHours ? `<div style="color:#94a3b8;font-size:11px;margin-top:4px;">${q.durationHours}h booking</div>` : ''}
  </div>` : ''}

  ${sectionHeading('Move Details')}
  <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
    ${row('Moving Type',     q.movingType)}
    ${row('Moving Date',     formatDate(q.movingDate))}
    ${row('Preferred Time',  q.preferredTime ? formatTime12h(q.preferredTime) : '')}
    ${row('Movers Needed',   q.moversNeeded)}
    ${q.durationHours ? row('Booking Duration', `${q.durationHours} hours`) : ''}
    ${row('Distance',        q.distanceMiles != null ? `${Number(q.distanceMiles).toFixed(1)} miles` : '')}
  </table>

  ${sectionHeading('Route')}
  <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
    ${row('Pickup',   locationLine(q.pickup))}
    ${stopsRows(q.stops)}
    ${row('Delivery', locationLine(q.delivery))}
  </table>

  ${propertyDetailsBlock(q.propertyDetails)}
  ${packingLines(q.packingMaterials)}
  ${parkingBlock(q.propertyDetails)}

  ${q.notes ? `
    ${sectionHeading('Additional Notes')}
    <div style="padding:12px;background:#f8fafc;border-radius:6px;color:#0F172A;font-size:14px;white-space:pre-wrap;">${q.notes}</div>
  ` : ''}

  ${q.estimatedPrice ? `
    ${sectionHeading('Pricing Summary')}
    <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
      ${row('Estimated total', `£${q.estimatedPrice}`)}
      ${q.packingMaterials?.total ? row('Includes packing materials', `£${q.packingMaterials.total}`) : ''}
    </table>
  ` : ''}

  <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:8px;font-size:13px;color:#475569;">
    Reply to this customer within 30 minutes to maximise booking conversion.
  </div>
`);

// ── Customer confirmation template ───────────────────────────────────────────
export const quoteConfirmationCustomerTemplate = (q) => wrap(`
  <h2 style="margin:0 0 8px;font-size:22px;">Thanks, ${q.customer.name.split(' ')[0]} 👋</h2>
  <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
    We've received your ${q.kind === 'booking' ? 'booking' : 'quote request'} and our team will confirm the details within
    <strong style="color:#F97316;">30 minutes</strong> during business hours.
  </p>

  ${q.estimatedPrice ? `
  <div style="background:linear-gradient(135deg,#F97316,#fb923c);border-radius:10px;padding:20px;text-align:center;margin-bottom:24px;color:#fff;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.85;margin-bottom:4px;">Estimated total</div>
    <div style="font-size:32px;font-weight:800;">£${q.estimatedPrice}</div>
    ${q.durationHours ? `<div style="font-size:12px;opacity:0.85;margin-top:4px;">${q.moversNeeded || ''} · ${q.durationHours}h booking</div>` : ''}
  </div>` : ''}

  ${sectionHeading('Your Details')}
  <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
    ${row('Name',  q.customer.name)}
    ${row('Email', q.customer.email)}
    ${row('Phone', q.customer.phone)}
  </table>

  ${sectionHeading('Booking Details')}
  <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
    ${row('Move type',      q.movingType)}
    ${row('Move date',      formatDate(q.movingDate))}
    ${row('Preferred time', q.preferredTime ? formatTime12h(q.preferredTime) : '')}
    ${row('Team',           q.moversNeeded)}
    ${q.durationHours ? row('Duration', `${q.durationHours} hours`) : ''}
  </table>

  ${sectionHeading('Route')}
  <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
    ${row('Pickup',   locationLine(q.pickup))}
    ${stopsRows(q.stops)}
    ${row('Delivery', locationLine(q.delivery))}
  </table>

  ${propertyDetailsBlock(q.propertyDetails)}
  ${packingLines(q.packingMaterials)}
  ${parkingBlock(q.propertyDetails)}

  ${(q.propertyDetails?.dismantling || q.propertyDetails?.reassembly || q.packingMaterials?.requested) ? `
    ${sectionHeading('Services Selected')}
    <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
      ${q.packingMaterials?.requested ? row('Packing service', 'Yes') : ''}
      ${q.propertyDetails?.dismantling ? row('Dismantling', 'Yes') : ''}
      ${q.propertyDetails?.reassembly  ? row('Reassembly',  'Yes') : ''}
    </table>
  ` : ''}

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

// ── Welcome, password reset, accepted, rejected — unchanged ──────────────────
export const welcomeEmailTemplate = (user) => wrap(`
  <h2 style="margin:0 0 16px;font-size:22px;">Welcome, ${user.fullName.split(' ')[0]} 🎉</h2>
  <p style="color:#475569;font-size:15px;line-height:1.7;">
    Your account is ready. From your dashboard you can request quotes, track your bookings,
    and manage your details.
  </p>
  <div style="text-align:center;margin:32px 0 16px;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://londonexpressremovals.co.uk'}/my-bookings"
       style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F97316,#fb923c);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
      Go to dashboard
    </a>
  </div>
`);

export const passwordResetTemplate = (user, resetUrl) => wrap(`
  <h2 style="margin:0 0 16px;font-size:22px;">Reset your password</h2>
  <p style="color:#475569;font-size:15px;line-height:1.7;">
    Hi ${user.fullName.split(' ')[0]}, you asked to reset your password. Click the button below to choose a new one.
    The link is valid for one hour.
  </p>
  <div style="text-align:center;margin:32px 0 16px;">
    <a href="${resetUrl}"
       style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F97316,#fb923c);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
      Reset password
    </a>
  </div>
  <p style="font-size:12px;color:#94a3b8;text-align:center;">If you didn't request this, you can ignore this email.</p>
`);

export const quoteAcceptedTemplate = (q, message, price) => wrap(`
  <div style="text-align:center;margin-bottom:16px;">
    <div style="display:inline-block;width:56px;height:56px;background:#10b981;border-radius:50%;line-height:56px;color:#fff;font-size:28px;">✓</div>
  </div>
  <h2 style="margin:0 0 12px;font-size:22px;text-align:center;">Your move is confirmed</h2>
  <p style="color:#475569;font-size:15px;line-height:1.6;text-align:center;">${message || 'Your booking has been accepted by our team.'}</p>
  ${price ? `
  <div style="background:linear-gradient(135deg,#F97316,#fb923c);border-radius:10px;padding:20px;text-align:center;margin:24px 0;color:#fff;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.85;margin-bottom:4px;">Confirmed total</div>
    <div style="font-size:32px;font-weight:800;">£${price}</div>
  </div>` : ''}
  ${sectionHeading('Your Booking')}
  <table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
    ${row('Move date',      formatDate(q.movingDate))}
    ${row('Preferred time', q.preferredTime ? formatTime12h(q.preferredTime) : '')}
    ${row('Pickup',   locationLine(q.pickup))}
    ${stopsRows(q.stops)}
    ${row('Delivery', locationLine(q.delivery))}
  </table>
  <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;text-align:center;">Reference: ${q._id}</p>
`);

export const quoteRejectedTemplate = (q, message) => wrap(`
  <h2 style="margin:0 0 12px;font-size:22px;">About your quote request</h2>
  <p style="color:#475569;font-size:15px;line-height:1.6;">${message || "Unfortunately we can't take this booking on. If your dates or requirements are flexible, please get in touch."}</p>
  <div style="text-align:center;margin:32px 0 16px;">
    <a href="tel:${process.env.COMPANY_PHONE || '+447459180023'}"
       style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F97316,#fb923c);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
      Call our team
    </a>
  </div>
  <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;text-align:center;">Reference: ${q._id}</p>
`);
