import { Mentor } from '../models/mentor';

export async function initializeDatabase() {
  try {
    const count = await Mentor.countDocuments();
    if (count === 0) {
      const sampleMentors = [
        { name: 'Ria', category: 'AI', type: 'Investor' },
        { name: 'Martin', category: 'Blockchain', type: 'Mentor' },
        { name: 'Leo', category: 'EV', type: 'Mentor' },
        { name: 'Zack', category: 'Ecommerce', type: 'Mentor' },
        { name: 'Honia', category: 'Video', type: 'Investor' },
        { name: 'Sarah', category: 'Fintech', type: 'Investor' },
        { name: 'Michael', category: 'Healthcare', type: 'Mentor' },
        { name: 'Emma', category: 'EdTech', type: 'Investor' },
        { name: 'David', category: 'Cybersecurity', type: 'Mentor' },
        { name: 'Lisa', category: 'IoT', type: 'Investor' },
        { name: 'James', category: 'Gaming', type: 'Mentor' },
        { name: 'Anna', category: 'SaaS', type: 'Investor' },
        { name: 'Robert', category: 'CleanTech', type: 'Mentor' },
        { name: 'Julia', category: 'BioTech', type: 'Investor' },
        { name: 'Daniel', category: 'AR/VR', type: 'Mentor' }
      ];
      await Mentor.insertMany(sampleMentors);
      console.log('Sample mentors data initialized');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}