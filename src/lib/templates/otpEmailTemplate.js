/**
 * Simple, clean OTP verification email.
 * Kept minimal because most spam filters are aggressive with promotional emails,
 * and this needs to reliably reach the inbox.
 */
export const otpEmailTemplate = (code, expiryMinutes = 10) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your verification code</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="480" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <tr>
            <td style="background:#0F172A;padding:24px 32px;text-align:left;">
              <div style="color:#F97316;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">London Express Removals</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px 0;font-size:22px;color:#0F172A;font-weight:700;">Your verification code</h1>
              <p style="margin:0 0 24px 0;color:#64748B;font-size:15px;line-height:1.6;">
                Enter this 6-digit code on the booking page to confirm your email address.
              </p>
              <div style="background:#FFF7ED;border:2px solid #FED7AA;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px 0;">
                <div style="font-family:'Courier New',monospace;font-size:36px;font-weight:800;letter-spacing:0.4em;color:#EA580C;">
                  ${code}
                </div>
              </div>
              <p style="margin:0 0 8px 0;color:#64748B;font-size:13px;line-height:1.5;">
                This code expires in ${expiryMinutes} minutes.
              </p>
              <p style="margin:0;color:#64748B;font-size:13px;line-height:1.5;">
                If you didn't request this code, you can safely ignore this email — no booking has been made.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#F8FAFC;padding:20px 32px;border-top:1px solid #E2E8F0;">
              <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.5;">
                London Express Removals · Professional man &amp; van across London and the UK<br>
                <a href="https://londonexpressremovals.co.uk" style="color:#EA580C;text-decoration:none;">londonexpressremovals.co.uk</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
