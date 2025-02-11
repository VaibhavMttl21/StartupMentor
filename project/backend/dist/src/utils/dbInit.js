"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const mentor_1 = require("../models/mentor");
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield mentor_1.Mentor.countDocuments();
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
                yield mentor_1.Mentor.insertMany(sampleMentors);
                console.log('Sample mentors data initialized');
            }
        }
        catch (error) {
            console.error('Error initializing database:', error);
        }
    });
}
