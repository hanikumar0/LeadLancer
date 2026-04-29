import { Resend } from 'resend';
import OutreachLog from '../models/OutreachLog';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export const sendSingleEmail = async (
  userId: string,
  leadId: string,
  toEmail: string,
  subject: string,
  htmlMessage: string,
  campaignId?: string
) => {
  try {
    // 1. Create a pending log
    const log = await OutreachLog.create({
      userId,
      leadId,
      campaignId,
      toEmail,
      subject,
      message: htmlMessage,
      sendStatus: 'pending',
    });

    // 2. Send via Resend
    // In a real SaaS, the "from" address would use the user's verified domain or a system default.
    const sender = process.env.SYSTEM_SENDER_EMAIL || 'outreach@leadlancer.app';
    
    const { data, error } = await resend.emails.send({
      from: `LeadLancer <${sender}>`,
      to: [toEmail],
      subject,
      html: htmlMessage,
    });

    if (error) {
      log.sendStatus = 'failed';
      log.errorMessage = error.message;
      await log.save();
      return { success: false, error: error.message };
    }

    // 3. Update log on success
    log.sendStatus = 'sent';
    log.providerMessageId = data?.id;
    await log.save();

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
};
