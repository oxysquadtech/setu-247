import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { buildJobApplicationHtml, buildInvestorEnquiryHtml } from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const recipient = process.env.NOTIFICATION_EMAIL || 'oxysquadtechnologies@gmail.com';
const smtpUser = process.env.SMTP_USER || 'oxysquadtechnologies@gmail.com';
const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim();

console.log('----------------------------------------------------');
console.log('Setu247 Email Notification Diagnostic Tool');
console.log('----------------------------------------------------');
console.log('Recipient Address : ' + recipient);
console.log('SMTP Sender (From): ' + smtpUser);
console.log('SMTP Password Set : ' + (smtpPass ? 'YES (***' + smtpPass.slice(-4) + ')' : 'NO (EMPTY)'));
console.log('----------------------------------------------------');

if (!smtpPass) {
  console.log('❌ Reason why emails are not arriving in your inbox yet:');
  console.log('   SMTP_PASS is not set in your .env file.');
  console.log('');
  console.log('Your form submission was received and safely stored locally:');
  const subsFile = path.join(__dirname, 'storage', 'submissions.json');
  if (fs.existsSync(subsFile)) {
    try {
      const subs = JSON.parse(fs.readFileSync(subsFile, 'utf8'));
      console.log(`   Found ${subs.length} saved submission(s) in server storage:`);
      subs.forEach((s, idx) => {
        console.log(`   [${idx + 1}] Type: ${s.type.toUpperCase()} | Name: ${s.data.fullName} | Email: ${s.data.email || s.data.workEmail} | Files: ${s.files?.length || 0}`);
      });
    } catch {
      // ignore
    }
  }
  console.log('');
  console.log('To send these and all future submissions to oxysquadtechnologies@gmail.com:');
  console.log('1. Open https://myaccount.google.com/apppasswords');
  console.log('   (Sign in to oxysquadtechnologies@gmail.com)');
  console.log('2. Type "Setu247" and click "Create".');
  console.log('3. Copy the 16-character code (e.g. abcd efgh ijkl mnop).');
  console.log('4. Open your .env file and paste it:');
  console.log('   SMTP_PASS=abcdefghijklmnop');
  console.log('5. Re-run this check: npm run test-email');
  console.log('----------------------------------------------------');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

console.log('Testing SMTP connection with Gmail...');

try {
  await transporter.verify();
  console.log('✅ Connected to Gmail SMTP server!');

  console.log(`Sending live test email to ${recipient}...`);

  const info = await transporter.sendMail({
    from: `"Setu247 Gateway" <${smtpUser}>`,
    to: recipient,
    subject: `Test Email Notification – Setu247 System Verification`,
    html: `
      <div style="font-family: sans-serif; padding: 24px; background: #101114; color: #ffffff; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #38bdf8;">
        <h2 style="color: #38bdf8; margin-top: 0;">Setu247 Live Notifications Verified</h2>
        <p>This email confirms that your Setu247 website forms are connected to <strong>${recipient}</strong>.</p>
        <p>Every time a visitor submits a Job Application or Investor Enquiry, all information and uploaded documents will be delivered here automatically.</p>
        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; font-size: 13px; color: #a1a1aa;">
          Delivered: ${new Date().toLocaleString()}<br/>
          Server: smtp.gmail.com:465 (Direct TLS)<br/>
          Recipient: ${recipient}
        </div>
      </div>
    `,
  });

  console.log('✅ Test email successfully sent! Message ID:', info.messageId);

  // Check for any locally saved submissions to forward
  const subsFile = path.join(__dirname, 'storage', 'submissions.json');
  if (fs.existsSync(subsFile)) {
    const subs = JSON.parse(fs.readFileSync(subsFile, 'utf8'));
    const unforwarded = subs.filter(s => !s.forwardedToEmail);
    if (unforwarded.length > 0) {
      console.log(`\nForwarding ${unforwarded.length} pending submission(s) to ${recipient}...`);
      for (const item of unforwarded) {
        const isCareer = item.type === 'career';
        const subject = isCareer
          ? `New Job Application – ${item.data.fullName || 'Candidate'}`
          : `New Investor Enquiry – ${item.data.fullName || 'Investor'}`;
        const html = isCareer
          ? buildJobApplicationHtml(item.data, item.files)
          : buildInvestorEnquiryHtml(item.data, item.files);

        const attachments = (item.files || []).map(f => {
          if (f.storedPath && fs.existsSync(f.storedPath)) {
            return {
              filename: f.filename,
              path: f.storedPath,
              contentType: f.mimetype,
            };
          }
          return null;
        }).filter(Boolean);

        await transporter.sendMail({
          from: `"Setu247 Desk" <${smtpUser}>`,
          to: recipient,
          subject,
          html,
          attachments,
        });

        item.forwardedToEmail = true;
        item.forwardedAt = new Date().toISOString();
        console.log(`   ✓ Delivered pending ${item.type} submission from: ${item.data.fullName}`);
      }
      fs.writeFileSync(subsFile, JSON.stringify(subs, null, 2), 'utf8');
      console.log('✅ All pending submissions forwarded to your Gmail!');
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Done! Check your Gmail inbox at ${recipient}.`);
  console.log('----------------------------------------------------');
} catch (err) {
  console.error('❌ Failed to connect to Gmail:');
  console.error(err.message);
  console.log('');
  console.log('Troubleshooting tips:');
  console.log('1. Ensure 2-Step Verification is ON in your Google Account.');
  console.log('2. Ensure you generated an App Password from https://myaccount.google.com/apppasswords');
  console.log('3. Ensure you pasted all 16 letters into SMTP_PASS in .env without spaces.');
  console.log('----------------------------------------------------');
}
