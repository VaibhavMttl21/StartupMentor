import { google } from 'googleapis';
import { authenticateGmail } from '../config/gmail';
import { User } from '../models/user';
import { sendCreditExhaustedEmail } from '../config/email';

export const checkForRechargeEmails = async () => {
  console.log('Checking for recharge emails...');
  const auth = await authenticateGmail();
  if (!auth) {
    console.error('Failed to authenticate Gmail');
    return;
  }

  const gmail = google.gmail({ version: 'v1', auth });

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'subject:"recharge 5 credits"',
  });

  const messages = res.data.messages || [];
  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: message.id!,
    });

    const email = (msg.data as any).payload?.headers?.find((header: any) => header.name === 'From')?.value;
    const userEmail = email?.match(/<(.*)>/)?.[1];

    if (userEmail) {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        if (user.lastRecharge && new Date().getTime() - new Date(user.lastRecharge).getTime() < 24 * 60 * 60 * 1000) {
          await sendCreditExhaustedEmail(userEmail, 'Sorry, we are not offering additional credits at this time.');
        } else {
          user.credits += 5;
          user.lastRecharge = new Date();
          await user.save();
          await sendCreditExhaustedEmail(userEmail, 'Your credits have been recharged by 5.');
        }
      }
    }

    // Mark the message as read
    await gmail.users.messages.modify({
      userId: 'me',
      id: message.id!,
      requestBody: {
        removeLabelIds: ['UNREAD'],
      },
    });
  }
};