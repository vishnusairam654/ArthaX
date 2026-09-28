import { Injectable, Logger } from '@nestjs/common';

export interface SendOtpEmailResult {
  delivered: boolean;
  provider: 'resend' | 'console';
  messageId?: string;
  error?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Dispatches a 6-digit verification OTP code to the citizen's email address.
   * Uses Resend API when RESEND_API_KEY is configured, or logs to console as fallback.
   */
  async sendOtpEmail(
    toEmail: string,
    otpCode: string,
    expirySeconds: number = 300,
  ): Promise<SendOtpEmailResult> {
    const provider = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();
    const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;

    // Always log to backend terminal for developer observability
    this.logger.log(
      `[SOVEREIGN EMAIL GATEWAY] [Target: ${toEmail}] Verification Code: ${otpCode} | TTL: ${expirySeconds}s`,
    );

    // If provider is explicitly console or no API key configured, use console mock
    if (provider === 'console' || !apiKey) {
      if (!apiKey && provider === 'resend') {
        this.logger.warn(
          `RESEND_API_KEY is missing in environment. Falling back to console dispatch for ${toEmail}.`,
        );
      }
      return {
        delivered: true,
        provider: 'console',
      };
    }

    // Determine sender address
    // Resend requires onboarding@resend.dev unless a custom domain is verified
    let fromAddress = process.env.EMAIL_FROM || 'ARTHAX Identity <onboarding@resend.dev>';
    if (fromAddress.includes('@arthax.sovereign')) {
      fromAddress = 'ARTHAX Identity <onboarding@resend.dev>';
    }

    const expiryMinutes = Math.max(1, Math.round(expirySeconds / 60));
    const htmlContent = this.buildOtpEmailHtml(otpCode, expiryMinutes);
    const textContent = `Your ARTHAX Sovereign Verification Code is: ${otpCode}\n\nEnter this code within ${expiryMinutes} minutes to complete your GOV ID registration.\nIf you did not request this verification, please disregard this transmission.`;

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [toEmail],
          subject: `[ARTHAX] Sovereign Identity Verification Code: ${otpCode}`,
          html: htmlContent,
          text: textContent,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          (data && typeof data === 'object' && (data.message || data.error)) ||
          `Resend API error (${response.status} ${response.statusText})`;
        
        this.logger.error(`Resend dispatch to ${toEmail} failed: ${errorMsg}`);
        return {
          delivered: false,
          provider: 'resend',
          error: String(errorMsg),
        };
      }

      this.logger.log(
        `Successfully dispatched verification email via Resend to ${toEmail} (Message ID: ${data?.id || 'ok'})`,
      );

      return {
        delivered: true,
        provider: 'resend',
        messageId: data?.id,
      };
    } catch (err: any) {
      this.logger.error(
        `Network exception during Resend dispatch to ${toEmail}: ${err.message}`,
        err.stack,
      );
      return {
        delivered: false,
        provider: 'resend',
        error: err.message,
      };
    }
  }

  /**
   * Generates a high-fidelity branded HTML email following ARTHAX sovereign design tokens.
   */
  private buildOtpEmailHtml(otpCode: string, expiryMinutes: number): string {
    const formattedDigits = otpCode.split('').join('&nbsp;&nbsp;');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ARTHAX Sovereign Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F2EFE7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #262320;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F2EFE7;
      padding: 40px 16px;
    }
    .main {
      background-color: #FFFFFF;
      margin: 0 auto;
      width: 100%;
      max-width: 520px;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(51, 104, 160, 0.15);
      box-shadow: 0 12px 32px rgba(30, 58, 95, 0.08);
    }
    .top-bar {
      height: 4px;
      background: linear-gradient(90deg, #1E3A5F 0%, #3368A0 40%, #A8742A 70%, #1E3A5F 100%);
    }
    .header {
      padding: 32px 32px 20px 32px;
      text-align: center;
      background: #FAF8F5;
      border-bottom: 1px solid rgba(51, 104, 160, 0.08);
    }
    .badge {
      display: inline-block;
      font-family: monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #A8742A;
      background-color: rgba(168, 116, 42, 0.10);
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .title {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 24px;
      font-weight: 700;
      color: #1E3A5F;
      margin: 0 0 6px 0;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 13px;
      color: #5C574F;
      margin: 0;
      line-height: 1.5;
    }
    .content {
      padding: 32px;
      text-align: center;
    }
    .instruction {
      font-size: 14px;
      color: #5C574F;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .otp-container {
      background: linear-gradient(135deg, #FAF8F5 0%, #F2EFE7 100%);
      border: 2px dashed rgba(168, 116, 42, 0.40);
      border-radius: 14px;
      padding: 20px 16px;
      margin: 0 auto 24px auto;
      max-width: 320px;
    }
    .otp-label {
      font-family: monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #7A5217;
      margin-bottom: 6px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 0.18em;
      color: #1E3A5F;
    }
    .notice {
      background-color: rgba(200, 223, 219, 0.35);
      border: 1px solid rgba(51, 104, 160, 0.12);
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 12px;
      color: #3368A0;
      line-height: 1.5;
      text-align: left;
      margin-bottom: 24px;
    }
    .footer {
      padding: 20px 32px;
      background-color: #FAF8F5;
      border-top: 1px solid rgba(51, 104, 160, 0.08);
      font-size: 11px;
      color: #8C867A;
      text-align: center;
      line-height: 1.6;
    }
    .footer strong {
      color: #1E3A5F;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main">
      <div class="top-bar"></div>
      
      <div class="header">
        <div class="badge">STATE IDENTITY AUTHORITY • TREATY 409-C</div>
        <h1 class="title">Sovereign Verification Code</h1>
        <p class="subtitle">ARTHAX Government Identity Gateway Registry</p>
      </div>

      <div class="content">
        <p class="instruction">
          Use the following 6-digit cryptographic security code to authenticate and bind your official email address to your sovereign GOV&nbsp;ID:
        </p>

        <div class="otp-container">
          <div class="otp-label">One-Time Passcode</div>
          <div class="otp-code">${formattedDigits}</div>
        </div>

        <div class="notice">
          <strong>Security Protocol:</strong> This code is valid for <strong>${expiryMinutes} minutes</strong> and can only be used once. Never disclose this code or your sovereign credentials to anyone.
        </div>
      </div>

      <div class="footer">
        <strong>ARTHAX Sovereign Financial Ecosystem</strong><br>
        Autonomous Interbank Clearing • Double-Entry Central Settlement<br>
        If you did not request this identity linkage, you may safely ignore this message.
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}
