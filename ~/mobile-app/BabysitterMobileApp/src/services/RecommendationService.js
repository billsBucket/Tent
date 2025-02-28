import axios from 'axios';

export class RecommendationService {
  static async getRecommendations(parentPreferences, availableSitters) {
    try {
      // Call OpenAI API for intelligent matching
      const response = await axios.post('/api/recommendations/analyze', {
        parentPreferences,
        availableSitters,
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4",
        temperature: 0.7,
        max_tokens: 1000,
        systemMessage: `
          You are an expert childcare advisor. Analyze the parent preferences and babysitter profiles to find the best matches.
          Consider the following factors in order of importance:
          1. Safety and qualifications (certifications, background checks)
          2. Experience with relevant age groups
          3. Schedule compatibility
          4. Special skills matching parent requirements
          5. Location and travel time

          For each match, provide:
          - A match percentage (0-100)
          - Key strengths that make them suitable
          - Any potential concerns to discuss
          - Specific recommendations for parent-sitter communication
        `,
      });

      // Process and format the recommendations
      const recommendations = response.data.recommendations.map(rec => ({
        ...rec,
        matchScore: this.calculateMatchScore(rec.strengths, rec.concerns),
        formattedStrengths: this.formatStrengths(rec.strengths),
        formattedConcerns: this.formatConcerns(rec.concerns),
      }));

      return recommendations.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw new Error('Failed to generate recommendations. Please try again later.');
    }
  }

  static calculateMatchScore(strengths, concerns) {
    // Complex scoring algorithm based on strengths and concerns
    const baseScore = 70; // Start with a base score
    const strengthPoints = strengths.length * 5;
    const concernPoints = concerns.length * -5;

    let score = baseScore + strengthPoints + concernPoints;
    return Math.min(Math.max(score, 0), 100); // Ensure score is between 0 and 100
  }

  static formatStrengths(strengths) {
    return strengths.map(strength => ({
      id: Math.random().toString(36).substr(2, 9),
      text: strength,
      icon: this.getStrengthIcon(strength),
    }));
  }

  static formatConcerns(concerns) {
    return concerns.map(concern => ({
      id: Math.random().toString(36).substr(2, 9),
      text: concern,
      severity: this.assessConcernSeverity(concern),
    }));
  }

  static getStrengthIcon(strength) {
    const strengthKeywords = {
      'experience': 'award',
      'certification': 'check-circle',
      'education': 'book-open',
      'first aid': 'heart',
      'schedule': 'calendar',
      'communication': 'message-circle',
      'default': 'star'
    };

    return Object.entries(strengthKeywords).find(([key]) => 
      strength.toLowerCase().includes(key))?.[1] || strengthKeywords.default;
  }

  static assessConcernSeverity(concern) {
    const severityKeywords = {
      high: ['safety', 'emergency', 'critical', 'immediate'],
      medium: ['schedule', 'availability', 'communication'],
      low: ['preference', 'minor', 'suggestion']
    };

    const concernLower = concern.toLowerCase();
    for (const [severity, keywords] of Object.entries(severityKeywords)) {
      if (keywords.some(keyword => concernLower.includes(keyword))) {
        return severity;
      }
    }
    return 'low';
  }
}