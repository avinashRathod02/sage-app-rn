/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { textToSpeech, speechToText } from './speechUtils';
import { fetchQuestions, Question } from './apiRequest';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);

    // First fetch questions from API
    fetchQuestions(
      (questions: Question[]) => {
        setIsLoading(false);
        if (questions.length > 0) {
          const question = questions[0];
          setCurrentQuestion(question);

          // Speak the question
          textToSpeech(
            question.question || 'No question available',
            () => {
              console.log('Question spoken, now listening for answer...');

              // Listen for the answer
              speechToText(
                (recognizedText: string) => {
                  console.log('User answered:', recognizedText);
                  Alert.alert(
                    'Answer Recorded',
                    `You said: "${recognizedText}"`,
                  );
                },
                (error: any) => {
                  console.error('Speech recognition failed:', error);
                  Alert.alert('Error', 'Failed to recognize speech');
                },
              );
            },
            (error: any) => {
              console.error('TTS failed:', error);
              Alert.alert('Error', 'Failed to speak question');
            },
          );
        } else {
          Alert.alert('No Questions', 'No questions available from the API');
        }
      },
      (error: string) => {
        setIsLoading(false);
        console.error('API Error:', error);
        Alert.alert('API Error', `Failed to fetch questions: ${error}`);
      },
    );
  };

  const handleTestAPI = () => {
    setIsLoading(true);

    fetchQuestions(
      (questions: Question[]) => {
        setIsLoading(false);
        Alert.alert(
          'API Success',
          `Fetched ${questions.length} questions successfully!`,
        );
        console.log('Questions:', questions);
      },
      (error: string) => {
        setIsLoading(false);
        Alert.alert('API Error', error);
        console.error('API Error:', error);
      },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.centerContainer}>
        <Text style={styles.title}>Speech + API Demo App</Text>
        <Text style={styles.subtitle}>
          Fetch questions from API and interact with speech
        </Text>

        {currentQuestion && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionLabel}>Current Question:</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.startButton, isLoading && styles.disabledButton]}
          onPress={handleStart}
          disabled={isLoading}
        >
          <Text style={styles.startButtonText}>
            {isLoading ? 'Loading...' : 'Start Question Demo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, isLoading && styles.disabledButton]}
          onPress={handleTestAPI}
          disabled={isLoading}
        >
          <Text style={styles.testButtonText}>
            {isLoading ? 'Loading...' : 'Test API Connection'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    width: '100%',
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
