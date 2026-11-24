import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { sendJobApplicationEmail, sendInvestorEnquiryEmail } from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, 'storage', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure Multer storage to safely preserve original extensions and unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedOriginal}`);
  },
});

// Allow files up to 25MB (standard email attachment limit)
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

export const apiRouter = express.Router();

// Parse JSON and URL-encoded bodies for non-multipart requests
apiRouter.use(express.json({ limit: '30mb' }));
apiRouter.use(express.urlencoded({ extended: true, limit: '30mb' }));

/**
 * Health check endpoint
 */
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Setu247 Notification Gateway',
    recipient: 'oxysquadtechnologies@gmail.com',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Endpoint: Job Application Form
 * POST /api/careers
 */
apiRouter.post('/careers', upload.any(), async (req, res) => {
  try {
    const data = req.body;
    const files = req.files || [];

    // Anti-spam honeypot
    if (data.honeypot && String(data.honeypot).trim() !== '') {
      return res.status(400).json({ success: false, message: 'Automated request detected' });
    }

    if (!data.fullName || !data.email) {
      return res.status(400).json({
        success: false,
        message: 'Full Name and Email Address are required.',
      });
    }

    if (!data.phone || data.phone.trim().length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit mobile number is required.',
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Resume upload is compulsory. Please attach your resume document.',
      });
    }

    const referenceId = data.referenceId || `SETU-TALENT-${Date.now().toString(36).toUpperCase()}`;
    const payload = { ...data, referenceId };

    const result = await sendJobApplicationEmail(payload, files);

    return res.status(200).json({
      success: true,
      referenceId,
      message: 'Thank you for your interest in Setu247. Your application has been received. Our team will review it and reach out if there is a suitable opportunity.',
      details: {
        delivered: result.delivered,
        recipient: result.recipient,
        filesAttached: files.length,
      },
    });
  } catch (error) {
    console.error('[API Error] /api/careers failed:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal error occurred while processing your application. Please email directly to oxysquadtechnologies@gmail.com.',
      error: error.message,
    });
  }
});

/**
 * Endpoint: Investor Enquiry Form
 * POST /api/investors
 */
apiRouter.post('/investors', upload.any(), async (req, res) => {
  try {
    const data = req.body;
    const files = req.files || [];

    if (data.honeypot && String(data.honeypot).trim() !== '') {
      return res.status(400).json({ success: false, message: 'Automated request detected' });
    }

    if (!data.fullName || (!data.workEmail && !data.email)) {
      return res.status(400).json({
        success: false,
        message: 'Name and Work Email are required.',
      });
    }

    const referenceId = data.referenceId || `SETU-INV-${Date.now().toString(36).toUpperCase()}`;
    const payload = {
      ...data,
      referenceId,
      workEmail: data.workEmail || data.email,
    };

    const result = await sendInvestorEnquiryEmail(payload, files);

    return res.status(200).json({
      success: true,
      referenceId,
      message: 'Thank you for your interest in Setu247. Your enquiry has been received. Our team will get in touch if there is a potential opportunity to connect.',
      details: {
        delivered: result.delivered,
        recipient: result.recipient,
        filesAttached: files.length,
      },
    });
  } catch (error) {
    console.error('[API Error] /api/investors failed:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal error occurred while processing your enquiry. Please email directly to oxysquadtechnologies@gmail.com.',
      error: error.message,
    });
  }
});

/**
 * Secure file download endpoint
 */
apiRouter.get('/uploads/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(UPLOADS_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  return res.download(filePath);
});
