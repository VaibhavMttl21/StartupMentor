import { User } from '../models/user';
import { sendCreditExhaustedEmail } from '../config/email';

export class UserService {
  static async getOrCreateUser(email: string) {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        credits: 5
      });
    }
    return user;
  }

  static async checkAndHandleCredits(user: any) {
    if (user.credits <= 0) {
      console.log("User credits exhausted, sending email");
      await sendCreditExhaustedEmail(user.email, 'Your credits are exhausted. Please check your email to recharge.');
      // credit logic
      
      return false;
    }
    return true;
  }

  static async deductCredit(userId: string) {
    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );
  }
}