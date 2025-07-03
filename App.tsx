import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import { fetchQuestions, Question } from './apiRequest';
import Animated, { CurvedTransition } from 'react-native-reanimated';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPressed, setButtonPressed] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [initialParams, setInitialParams] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'system',
      message: 'Welcome to the Sage App! How can I assist you today?',
    },
    {
      role: 'user',
      message: 'Avinash Rathod',
    },
  ]);

  useEffect(() => {
    // Initialize TTS
    Tts.setDefaultLanguage('en-US');
    Tts.engines().then(voices => {
      console.log('Available voices:', voices);
    });

    // Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);

    // Set up TTS event listeners
    Tts.addEventListener('tts-start', () => {
      setIsSpeaking(true);
    });

    Tts.addEventListener('tts-finish', () => {
      setIsSpeaking(false);
    });

    Tts.addEventListener('tts-cancel', () => {
      setIsSpeaking(false);
    });

    // Set up Voice event listeners
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setButtonPressed('Listening...');
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    Voice.onSpeechResults = event => {
      if (event.value && event.value.length > 0) {
        setRecognizedText(event.value[0]);
        setButtonPressed(`Recognized: "${event.value[0]}"`);
      }
    };

    Voice.onSpeechError = error => {
      console.error('Speech recognition error:', error);
      setIsListening(false);
      setButtonPressed('Speech recognition failed');
      Alert.alert('Error', 'Speech recognition failed. Please try again.');
    };

    return () => {
      // Clean up TTS event listeners
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');

      // Clean up Voice
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleTextToSpeech = async () => {
    try {
      if (isSpeaking) {
        await Tts.stop();
        setIsSpeaking(false);
        setButtonPressed('Speech stopped');
      } else {
        setButtonPressed('Speaking: "Hello how are you"');
        await Tts.speak(`Hy How are you`);
      }
    } catch (error) {
      console.error('TTS Error:', error);
      Alert.alert('Error', 'Text-to-Speech failed. Please try again.');
      setIsSpeaking(false);
    }
  };

  const handleSpeechToText = async () => {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
        setButtonPressed('Stopped listening');
      } else {
        setRecognizedText('');
        setButtonPressed('Starting to listen...');
        await Voice.start('en-US');
      }
    } catch (error) {
      console.error('Voice start error:', error);
      Alert.alert('Error', 'Failed to start speech recognition');
      setIsListening(false);
    }
  };
  const fetchQuestionList = () => {
    setIsLoading(true);
    const onSuccess = res => {
      setIsLoading(false);
      console.log('Questions:', res.data);
      setInitialParams({
        ...res.data?.question,
        user_data: res.data?.user_data,
      });
      if (res.data?.question_intro) {
        // Tts.speak(res.data?.question_intro);
        setMessages([
          {
            role: 'system',
            message: res.data?.question_intro,
          },
        ]);
      }
      if (res.data?.question?.question) {
        // Tts.speak(res.data?.question?.question);
        setMessages(prev => [
          ...prev,
          { role: 'system', message: res.data?.question?.question },
        ]);
      }
    };
    fetchQuestions(onSuccess, () => setIsLoading(false));
  };
  useEffect(() => {
    // fetchQuestionList();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={messages}
        style={{ height: '80%' }}
        keyExtractor={(item, index) => `message-${index}`}
        renderItem={({ item }) => {
          const isSystem = item.role === 'system';
          return (
            <View
              style={[styles.bubbleContainer, isSystem && styles.systemBubble]}
            >
              <View
                style={[
                  styles.bubble,
                  !isSystem && { backgroundColor: '#bae8e0' },
                ]}
              >
                <Animated.Text
                  layout={CurvedTransition}
                  style={{ fontSize: 16, color: '#333' }}
                >
                  {item.message}
                </Animated.Text>
              </View>
            </View>
          );
        }}
        layout={CurvedTransition}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.ttsButton]}
          onPress={handleTextToSpeech}
        >
          <Text style={styles.buttonText}>
            {isSpeaking ? 'Stop Speaking' : 'Text to Speech'}
          </Text>
          <Text style={styles.buttonSubText}>
            {isSpeaking ? 'Speaking...' : 'Say "Hello how are you"'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.sttButton]}
          onPress={handleSpeechToText}
        >
          <Text style={styles.buttonText}>
            {isListening ? 'Stop Listening' : 'Speech to Text'}
          </Text>
          <Text style={styles.buttonSubText}>
            {isListening ? 'Listening...' : 'Tap to start recording'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
  },
  bubble: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    maxWidth: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  systemBubble: {
    justifyContent: 'flex-start',
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
    paddingTop: 50,
  },
  buttonsContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ttsButton: {
    backgroundColor: '#34C759',
  },
  sttButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonSubText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
});

export default App;
