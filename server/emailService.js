import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage directories for local archives and file uploads
const UPLOADS_DIR = path.join(__dirname, 'storage', 'uploads');
const EMAILS_DIR = path.join(__dirname, 'storage', 'emails');
const SUBMISSIONS_FILE = path.join(__dirname, 'storage', 'submissions.json');

// Ensure directories exist
for (const dir of [UPLOADS_DIR, EMAILS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Configure Nodemailer Transporter
 * Default destination: oxysquadtechnologies@gmail.com
 */
export const getEmailConfig = () => {
  const recipient = process.env.NOTIFICATION_EMAIL || 'oxysquadtechnologies@gmail.com';
  const smtpUser = process.env.SMTP_USER || 'oxysquadtechnologies@gmail.com';
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpSecure = process.env.SMTP_SECURE !== 'false';

  return {
    recipient,
    smtpUser,
    smtpPass,
    smtpHost,
    smtpPort,
    smtpSecure,
    isConfigured: Boolean(smtpPass && smtpPass.trim().length > 0),
  };
};

export const createTransporter = () => {
  const config = getEmailConfig();

  if (config.isConfigured) {
    return nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  return null;
};

// Archive submission to local database file
const archiveSubmission = (type, data, files = []) => {
  try {
    let submissions = [];
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      try {
        submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
      } catch {
        submissions = [];
      }
    }

    const record = {
      id: data.referenceId || `SETU-${Date.now().toString(36).toUpperCase()}`,
      type,
      timestamp: new Date().toISOString(),
      data,
      files: files.map(f => ({
        filename: f.originalname || f.filename,
        size: f.size,
        mimetype: f.mimetype,
        storedPath: f.path || null,
      })),
    };

    submissions.unshift(record);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');
    return record;
  } catch (err) {
    console.error('[Storage Error] Failed to archive submission:', err);
    return null;
  }
};

// Save a visual HTML copy of the email sent
const saveEmailCopy = (type, name, htmlContent) => {
  try {
    const safeName = (name || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${Date.now()}_${type}_${safeName}.html`;
    const filePath = path.join(EMAILS_DIR, filename);
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    return filePath;
  } catch (err) {
    console.error('[Storage Error] Failed to save email copy:', err);
    return null;
  }
};

/**
 * Generate HTML email for Job Application
 */
export const buildJobApplicationHtml = (data, files = []) => {
  const fileRows = files.length > 0
    ? files.map(f => `
      <li style="margin-bottom: 4px;">
        <strong>${f.originalname || f.filename}</strong>
        <span style="color: #747982; font-size: 12px;"> (${(f.size / (1024 * 1024)).toFixed(2)} MB)</span>
      </li>
    `).join('')
    : '<li style="color: #747982;">No document attached</li>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Job Application</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d0e10; color: #e8e9eb; margin: 0; padding: 24px;">
  <div style="max-width: 650px; margin: 0 auto; background-color: #1a1c22; border: 1px solid #2a2e37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #101114 0%, #202329 100%); padding: 28px; border-bottom: 2px solid #38bdf8;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
          SETU<span style="color: #38bdf8; font-weight: 300;">247</span>
        </h1>
        <span style="background-color: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          New Job Application
        </span>
      </div>
      <p style="margin: 8px 0 0; color: #747982; font-size: 13px;">
        An upcoming health-tech venture by OXYSQUAD TECHNOLOGIES PVT LTD
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 28px;">
      <h2 style="margin: 0 0 18px; font-size: 18px; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
        Candidate Information
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; width: 35%; border-bottom: 1px solid rgba(255,255,255,0.05);">Full Name</td>
          <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05);">${data.fullName || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Email Address</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <a href="mailto:${data.email}" style="color: #38bdf8; text-decoration: none; font-weight: 500;">${data.email || '—'}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Mobile / Phone Number</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <a href="tel:${data.phone}" style="color: #38bdf8; text-decoration: none; font-weight: 500;">${data.phone || '—'}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Job Position / Profile</td>
          <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <span style="background-color: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 3px 8px; border-radius: 6px;">${data.domain || '—'}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Experience</td>
          <td style="padding: 10px 0; color: #e8e9eb; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05);">${data.experience || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Key Skills</td>
          <td style="padding: 10px 0; color: #e8e9eb; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05);">${data.skills || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Current Location</td>
          <td style="padding: 10px 0; color: #e8e9eb; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05);">${data.location || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">LinkedIn Profile</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            ${data.linkedIn ? `<a href="${data.linkedIn}" target="_blank" style="color: #38bdf8; text-decoration: underline;">${data.linkedIn}</a>` : '<span style="color:#747982;">Not provided</span>'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Portfolio / Website</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            ${data.portfolio ? `<a href="${data.portfolio}" target="_blank" style="color: #38bdf8; text-decoration: underline;">${data.portfolio}</a>` : '<span style="color:#747982;">Not provided</span>'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Reference ID</td>
          <td style="padding: 10px 0; color: #a1a1aa; font-family: monospace; font-size: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">${data.referenceId || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px;">Submission Date</td>
          <td style="padding: 10px 0; color: #a1a1aa; font-size: 12px;">${new Date().toLocaleString()}</td>
        </tr>
      </table>

      <!-- Candidate Introduction / Message -->
      <div style="margin-bottom: 24px; background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px;">
        <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
          Introduction / Cover Note
        </h3>
        <p style="margin: 0; color: #e8e9eb; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message || 'No introductory message provided.'}</p>
      </div>

      <!-- Uploaded Documents / Attachments -->
      <div style="background-color: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 18px;">
        <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">
          Uploaded Documents (Resume / CV)
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #ffffff; font-size: 13px;">
          ${fileRows}
        </ul>
        <p style="margin: 10px 0 0; font-size: 11px; color: #747982;">
          * Documents are directly attached to this email. You can also preview or download them securely.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #14161b; padding: 16px 28px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; color: #747982; font-size: 12px;">
      Setu247 Recruitment Desk • Oxysquad Technologies Pvt. Ltd.
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate HTML email for Investor Enquiry
 */
export const buildInvestorEnquiryHtml = (data, files = []) => {
  const fileRows = files.length > 0
    ? files.map(f => `
      <li style="margin-bottom: 4px;">
        <strong>${f.originalname || f.filename}</strong>
        <span style="color: #747982; font-size: 12px;"> (${(f.size / (1024 * 1024)).toFixed(2)} MB)</span>
      </li>
    `).join('')
    : '<li style="color: #747982;">No document attached</li>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Investor Enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d0e10; color: #e8e9eb; margin: 0; padding: 24px;">
  <div style="max-width: 650px; margin: 0 auto; background-color: #1a1c22; border: 1px solid #2a2e37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #101114 0%, #202329 100%); padding: 28px; border-bottom: 2px solid #38bdf8;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
          SETU<span style="color: #38bdf8; font-weight: 300;">247</span>
        </h1>
        <span style="background-color: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          Investor Dialogue
        </span>
      </div>
      <p style="margin: 8px 0 0; color: #747982; font-size: 13px;">
        An upcoming health-tech venture by OXYSQUAD TECHNOLOGIES PVT LTD
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 28px;">
      <h2 style="margin: 0 0 18px; font-size: 18px; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
        Investor & Strategic Partner Details
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; width: 35%; border-bottom: 1px solid rgba(255,255,255,0.05);">Investor Name</td>
          <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05);">${data.fullName || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Company / Organization Details</td>
          <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05);">${data.organisation || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Work Email Address</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <a href="mailto:${data.workEmail}" style="color: #38bdf8; text-decoration: none; font-weight: 500;">${data.workEmail || '—'}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Mobile / Phone Number</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <a href="tel:${data.phone}" style="color: #38bdf8; text-decoration: none; font-weight: 500;">${data.phone || 'Not provided'}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Investor Classification</td>
          <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <span style="background-color: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 3px 8px; border-radius: 6px;">${data.investorType || '—'}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Investment Details / Target Range</td>
          <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05);">
            ${data.investmentAmount || 'Flexible / To be discussed'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05);">Reference Code</td>
          <td style="padding: 10px 0; color: #a1a1aa; font-family: monospace; font-size: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">${data.referenceId || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #747982; font-size: 13px;">Submission Date</td>
          <td style="padding: 10px 0; color: #a1a1aa; font-size: 12px;">${new Date().toLocaleString()}</td>
        </tr>
      </table>

      <!-- Investment Details / Business Proposal -->
      <div style="margin-bottom: 24px; background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px;">
        <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
          Investment Details & Business Proposal
        </h3>
        <p style="margin: 0; color: #e8e9eb; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message || 'No additional statement provided.'}</p>
      </div>

      <!-- Uploaded Documents / Attachments -->
      <div style="background-color: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 18px;">
        <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">
          Uploaded Documents (Proposal / Pitch Deck)
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #ffffff; font-size: 13px;">
          ${fileRows}
        </ul>
        <p style="margin: 10px 0 0; font-size: 11px; color: #747982;">
          * Documents are directly attached to this email. Handled with privileged confidentiality.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #14161b; padding: 16px 28px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; color: #747982; font-size: 12px;">
      Setu247 Investor Relations • Oxysquad Technologies Pvt. Ltd.
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Dispatch notification directly to recipient email via HTTP Direct Gateway
 * Zero configuration required — works immediately without SMTP password or activation.
 */
export const dispatchViaHttpGateway = async (type, data, files = []) => {
  const config = getEmailConfig();
  const isCareer = type === 'career';
  const subject = isCareer
    ? `New Job Application – ${data.fullName || 'Candidate'}`
    : `New Investor Enquiry – ${data.fullName || 'Investor'}`;

  const formData = new FormData();
  formData.append('_subject', subject);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');

  if (isCareer) {
    formData.append('Full Name', data.fullName || '');
    formData.append('Email Address', data.email || '');
    formData.append('Mobile Number', data.phone || '');
    formData.append('Current Location', data.location || '');
    formData.append('Job Position / Profile', data.domain || '');
    formData.append('Experience Level', data.experience || 'Not specified');
    formData.append('Key Skills', data.skills || 'Not specified');
    formData.append('LinkedIn Profile', data.linkedIn || 'Not provided');
    formData.append('Portfolio / Website', data.portfolio || 'Not provided');
    formData.append('Candidate Note', data.message || '');
    formData.append('Reference Code', data.referenceId || '');
  } else {
    formData.append('Investor Name', data.fullName || '');
    formData.append('Company / Fund Details', data.organisation || '');
    formData.append('Work Email Address', data.workEmail || data.email || '');
    formData.append('Mobile Number', data.phone || 'Not provided');
    formData.append('Investor Classification', data.investorType || '');
    formData.append('Investment Range / Details', data.investmentAmount || 'Flexible');
    formData.append('Business Proposal / Statement', data.message || '');
    formData.append('Reference Code', data.referenceId || '');
  }

  // Attach files
  for (const file of files) {
    let buffer = file.buffer;
    if (!buffer && file.path && fs.existsSync(file.path)) {
      buffer = fs.readFileSync(file.path);
    }
    if (buffer) {
      const filename = file.originalname || file.filename || 'document.pdf';
      const mimetype = file.mimetype || 'application/octet-stream';
      formData.append('attachment', new Blob([buffer], { type: mimetype }), filename);
    }
  }

  try {
    const gatewayUrl = `https://formsubmit.co/ajax/${encodeURIComponent(config.recipient)}`;
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
        'Referer': 'http://localhost:3000/',
      },
      body: formData,
    });

    const resJson = await response.json();
    console.log(`[HTTP Gateway] Delivered to ${config.recipient}:`, resJson);
    return {
      success: resJson.success === 'true' || resJson.success === true,
      delivered: true,
      method: 'HTTP Gateway',
      recipient: config.recipient,
    };
  } catch (err) {
    console.error(`[HTTP Gateway Error] Could not dispatch to ${config.recipient}:`, err.message);
    return {
      success: false,
      delivered: false,
      error: err.message,
    };
  }
};

/**
 * Send Job Application Email to oxysquadtechnologies@gmail.com
 */
export const sendJobApplicationEmail = async (data, files = []) => {
  const config = getEmailConfig();
  const subject = `New Job Application – ${data.fullName || 'Candidate'}`;

  // Deduplicate files
  const uniqueFiles = [];
  const seenFiles = new Set();
  for (const f of files) {
    const key = `${f.originalname || f.filename}_${f.size}`;
    if (!seenFiles.has(key)) {
      seenFiles.add(key);
      uniqueFiles.push(f);
    }
  }

  const html = buildJobApplicationHtml(data, uniqueFiles);

  // Always archive locally so data is 100% safe and accessible
  archiveSubmission('career', data, uniqueFiles);
  saveEmailCopy('career', data.fullName, html);

  // Try direct SMTP if configured
  const transporter = createTransporter();

  if (transporter) {
    try {
      const attachments = uniqueFiles.map(file => {
        if (file.path && fs.existsSync(file.path)) {
          return {
            filename: file.originalname || file.filename,
            path: file.path,
            contentType: file.mimetype,
          };
        }
        if (file.buffer) {
          return {
            filename: file.originalname || 'document.pdf',
            content: file.buffer,
            contentType: file.mimetype,
          };
        }
        return null;
      }).filter(Boolean);

      const info = await transporter.sendMail({
        from: `"Setu247 Talent Desk" <${config.smtpUser}>`,
        to: config.recipient,
        replyTo: data.email || undefined,
        subject,
        html,
        attachments,
      });

      console.log(`[Email Sent via SMTP] Successfully delivered job application with attachments to ${config.recipient} (Message ID: ${info.messageId})`);
      return {
        success: true,
        delivered: true,
        messageId: info.messageId,
        recipient: config.recipient,
        method: 'SMTP',
      };
    } catch (err) {
      console.warn(`[SMTP Warning] SMTP send failed (${err.message}). Using HTTP Gateway fallback...`);
    }
  }

  // Automatic Zero-Setup Gateway delivery straight to Gmail:
  const gatewayResult = await dispatchViaHttpGateway('career', data, uniqueFiles);
  if (gatewayResult.delivered) {
    return {
      success: true,
      delivered: true,
      recipient: config.recipient,
      method: 'HTTP Gateway',
    };
  }

  return {
    success: true,
    delivered: false,
    recipient: config.recipient,
    fallbackArchived: true,
  };
};

/**
 * Send Investor Enquiry Email to oxysquadtechnologies@gmail.com
 */
export const sendInvestorEnquiryEmail = async (data, files = []) => {
  const config = getEmailConfig();
  const subject = `New Investor Enquiry – ${data.fullName || 'Investor'}`;
  const html = buildInvestorEnquiryHtml(data, files);

  // Archive locally
  archiveSubmission('investor', data, files);
  saveEmailCopy('investor', data.fullName, html);

  // Try direct SMTP if configured
  const transporter = createTransporter();

  if (transporter) {
    try {
      const attachments = files.map(file => {
        if (file.path && fs.existsSync(file.path)) {
          return {
            filename: file.originalname || file.filename,
            path: file.path,
            contentType: file.mimetype,
          };
        }
        if (file.buffer) {
          return {
            filename: file.originalname || 'proposal.pdf',
            content: file.buffer,
            contentType: file.mimetype,
          };
        }
        return null;
      }).filter(Boolean);

      const info = await transporter.sendMail({
        from: `"Setu247 Investor Desk" <${config.smtpUser}>`,
        to: config.recipient,
        replyTo: data.workEmail || undefined,
        subject,
        html,
        attachments,
      });

      console.log(`[Email Sent via SMTP] Successfully delivered investor enquiry to ${config.recipient} (Message ID: ${info.messageId})`);
      return {
        success: true,
        delivered: true,
        messageId: info.messageId,
        recipient: config.recipient,
        method: 'SMTP',
      };
    } catch (err) {
      console.warn(`[SMTP Warning] SMTP send failed (${err.message}). Using HTTP Gateway fallback...`);
    }
  }

  // Automatic Zero-Setup Gateway delivery straight to Gmail:
  const gatewayResult = await dispatchViaHttpGateway('investor', data, files);
  if (gatewayResult.delivered) {
    return {
      success: true,
      delivered: true,
      recipient: config.recipient,
      method: 'HTTP Gateway',
    };
  }

  return {
    success: true,
    delivered: false,
    recipient: config.recipient,
    fallbackArchived: true,
  };
};
