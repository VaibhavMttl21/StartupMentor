import { google } from 'googleapis';
import { authenticateGmail } from '../config/gmail';
import { User } from '../models/user';
import { sendCreditExhaustedEmail } from '../config/email';

export const checkForRechargeEmails = async (userEmail: string) => {
  console.log('Checking for recharge emails...');
  console.log('User email:', userEmail);
  const auth = await authenticateGmail();
  if (!auth) {
    console.error('Failed to authenticate Gmail');
    return;
  }
  console.log('User email12:', userEmail);
  const gmail = google.gmail({ version: 'v1', auth });
  console.log('User email232323:', userEmail);
  try {
    // console.log('User email:', userEmail);
    // const res = await gmail.users.messages.list({
    //   userId: 'me',
    //   q: `from:${userEmail} subject:"recharge 5 credits"`,
    // });
    console.log('User email12321332:', userEmail);
    // const messages = res.data.messages || [];
    // for (const message of messages) {
    //   const msg = await gmail.users.messages.get({
    //     userId: 'me',
    //     id: message.id!,
    //   });

      // const email = (msg.data as any).payload?.headers?.find((header: any) => header.name === 'From')?.value;
      console.log('User email:', userEmail);
      if (userEmail) {
        console.log('User email:', userEmail);
        const user = await User.findOne({ email: userEmail });
        if (user) {
          if (user.lastRecharge && new Date().getTime() - new Date(user.lastRecharge).getTime() < 24 * 60 * 60 * 1000) {
            console.log('User email:', userEmail);
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
      // await gmail.users.messages.modify({
      //   userId: 'me',
      //   id: message.id!,
      //   requestBody: {
      //     removeLabelIds: ['UNREAD'],
      //   },
      // });
    // }
  } catch (error) {
    console.error('Error checking for recharge emails:', error);
    throw new Error('Failed to check for recharge emails');
  }
};