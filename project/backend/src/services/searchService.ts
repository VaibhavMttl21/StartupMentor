import { Mentor } from '../models/mentor';

export class SearchService {
  static async findMatches(query: string) {
    const mentors = await Mentor.find();
    const keywords = query.toLowerCase().split(' ');
    
    return mentors.filter(mentor => 
      keywords.some(keyword => 
        mentor.category.toLowerCase().includes(keyword) ||
        mentor.type.toLowerCase().includes(keyword)
      )
    );
  }
}