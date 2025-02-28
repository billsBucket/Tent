import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import { RecommendationService } from '../services/RecommendationService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/progress';

const MOCK_PARENT_PREFERENCES = {
  childrenAges: ['2', '5'],
  schedule: 'Weekday afternoons, occasional evenings',
  specialRequirements: 'Experience with special needs children',
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  maxDistance: 10, // miles
  preferredCertifications: ['First Aid', 'CPR', 'Early Childhood Education'],
};

export default function RecommendationsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await RecommendationService.getRecommendations(
        MOCK_PARENT_PREFERENCES,
        [] // Available sitters would come from your backend
      );
      setRecommendations(results);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMatchScore = (score) => (
    <View style={styles.scoreContainer}>
      <Progress value={score} />
      <Text style={[styles.scoreText, { color: colors.text }]}>
        {score}% Match
      </Text>
    </View>
  );

  const renderStrengths = (strengths) => (
    <View style={styles.strengthsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Strengths</Text>
      {strengths.map((strength) => (
        <View key={strength.id} style={styles.strengthItem}>
          <Icon name={strength.icon} size={16} color={colors.primary} />
          <Text style={[styles.strengthText, { color: colors.text }]}>
            {strength.text}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderConcerns = (concerns) => (
    <View style={styles.concernsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Considerations</Text>
      {concerns.map((concern) => (
        <View
          key={concern.id}
          style={[
            styles.concernItem,
            {
              backgroundColor:
                concern.severity === 'high'
                  ? colors.destructive
                  : concern.severity === 'medium'
                  ? colors.secondary
                  : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.concernText,
              { color: concern.severity === 'high' ? '#FFF' : colors.text },
            ]}
          >
            {concern.text}
          </Text>
        </View>
      ))}
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Icon name="alert-triangle" size={48} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <Button onPress={loadRecommendations} style={styles.retryButton}>
            Try Again
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            AI Recommendations
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.placeholder }]}>
            Personalized matches for your family
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.placeholder }]}>
            Finding your perfect matches...
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} style={styles.recommendationCard}>
              <View style={styles.cardHeader}>
                <View style={styles.sitterInfo}>
                  <Text style={[styles.sitterName, { color: colors.text }]}>
                    {recommendation.name}
                  </Text>
                  <Text style={[styles.sitterExperience, { color: colors.placeholder }]}>
                    {recommendation.yearsOfExperience} years experience
                  </Text>
                </View>
                {renderMatchScore(recommendation.matchScore)}
              </View>

              {renderStrengths(recommendation.formattedStrengths)}
              {renderConcerns(recommendation.formattedConcerns)}

              <Button
                onPress={() => navigation.navigate('SitterProfile', { sitterId: recommendation.id })}
                style={styles.viewProfileButton}
              >
                View Full Profile
              </Button>
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  recommendationCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sitterInfo: {
    flex: 1,
  },
  sitterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sitterExperience: {
    fontSize: 14,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    width: 100,
  },
  scoreText: {
    fontSize: 12,
    marginTop: 4,
  },
  strengthsContainer: {
    marginBottom: 16,
  },
  concernsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthText: {
    marginLeft: 8,
    fontSize: 14,
  },
  concernItem: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  concernText: {
    fontSize: 14,
  },
  viewProfileButton: {
    marginTop: 16,
  },
});