/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
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

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [buttonPressed, setButtonPressed] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    // Initialize TTS
    Tts.setDefaultLanguage('en-US');
    Tts.engines().then(voices => {
      console.log('Available voices:', voices);
    });

    Tts.setDefaultRate(0.5);
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Buttons Section */}
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

      {/* Status Display */}
      {buttonPressed ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Last Action:</Text>
          <Text style={styles.resultText}>{buttonPressed}</Text>
        </View>
      ) : null}

      {/* Recognized Text Display */}
      {recognizedText ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Recognized Text:</Text>
          <Text style={styles.resultText}>{recognizedText}</Text>
        </View>
      ) : null}

      <NewAppScreen templateFileName="App.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  resultContainer: {
    backgroundColor: '#F2F2F7',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
});

export default App;
