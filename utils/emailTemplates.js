/**
 * Generates a premium HTML email template for email verification based on user provided design.
 * @param {string} name - The name of the user.
 * @param {string} verificationLink - The verification URL.
 * @param {string} appUrl - The application URL.
 * @param {string} supportUrl - The support URL.
 * @returns {string} - The HTML string.
 */
const getVerificationEmailTemplate = (name, verificationLink, appUrl, supportUrl = '#') => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - LEARNBACK </title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0A192F;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1E293B;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 35px -10px rgba(0,0,0,0.3);
    }
    .header {
      background: linear-gradient(135deg, #13A4EC 0%, #7367F0 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0 0;
      color: rgba(255,255,255,0.9);
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
      color: #8892B0;
    }
    .content h2 {
      color: #13A4EC;
      font-size: 22px;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 24px;
      color: #a8b3cf;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #7367F0 0%, #4988C4 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 40px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(115,103,240,0.3);
      transition: transform 0.2s ease;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .divider {
      height: 1px;
      background: #2d3a4e;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      padding: 20px 30px 30px;
      font-size: 13px;
      color: #729EC9;
      background-color: #0A192F;
    }
    .footer a {
      color: #13A4EC;
      text-decoration: none;
    }
    .badge {
      background-color: #0A192F;
      border-radius: 20px;
      padding: 6px 12px;
      display: inline-block;
      font-size: 12px;
      color: #13A4EC;
      margin-top: 10px;
    }
    @media (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body style="margin:0;padding:20px 10px;background-color:#0A192F;">
  <div class="container">
    <div class="header">
      <h1>LEARNBACK</h1>
      <p>Peer-to-Peer Learning Platform</p>
    </div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thanks for joining <strong>LEARNBACK</strong> – where skills are swapped and knowledge grows. Please confirm your email address to start your learning journey.</p>
      <div style="text-align: center;">
        <a href="${verificationLink}" class="button">Verify Email</a>
      </div>
      <p style="margin-top: 24px; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: #0A192F; padding: 12px; border-radius: 8px; font-size: 12px;">${verificationLink}</p>
      <div class="divider"></div>
      <div class="badge">Secure • Fast • Community-Driven</div>
    </div>
    <div class="footer">
      <p>© 2025 L*EARNBACK. All rights reserved.<br>
      Built for skill exchange, by learners.<br>
      <a href="${appUrl}">Visit our platform</a> | <a href="${supportUrl}">Support</a></p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  getVerificationEmailTemplate
};
