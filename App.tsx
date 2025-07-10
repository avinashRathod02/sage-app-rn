import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import { Request } from './apiRequest';
import Animated, {
  CurvedTransition,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated';
import { LogBox } from 'react-native';
import { useAppStore } from './store/appStore';
import { Conversation } from './store/screens/conversation';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

interface Message {
  role: 'user' | 'system';
  message: string;
}

function App() {
  // scrollRef
  const scrollRef = useRef<FlatList>(null);
  const {
    initialParams,
    categories,
    setCategories,
    setInitialParams,
    userData,
    setUserData,
  } = useAppStore();

  const [conversationId, setConversationId] = useState(
    `CON${new Date().getTime()}`,
  );
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(1);
  const [category, setCategory] = useState(0);
  const [buttonPressed, setButtonPressed] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const submitAnswerRef = useRef<((answer: string) => void) | null>(null);

  useEffect(() => {
    Tts.setDefaultLanguage('en-US');

    Tts.setDefaultPitch(1.0);

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
        // Use the ref to call the latest submit function
        if (submitAnswerRef.current) {
          submitAnswerRef.current(event.value[0]);
        }
      }
    };

    Voice.onSpeechError = error => {
      console.error('Speech recognition error:', error);
      setIsListening(false);
      setButtonPressed('Speech recognition failed');
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
  function getPrompt(prompt, question, answer) {
    return prompt.replace('{question}', question).replace('{answer}', answer);
  }
  const submitAnswer = useCallback(
    (answer: string) => {
      if (!initialParams) return;
      const prompt = getPrompt(
        initialParams.question_prompt,
        initialParams.question,
        answer,
      );
      const params = {
        ...initialParams,
        user_data: userData,
        conversation_id: conversationId,
        response: answer,
        prompt,
        is_third_try: 0,
      };
      setMessages(prev => [...prev, { role: 'user', message: answer }]);
      scrollRef?.current?.scrollToEnd({ animated: true });
      console.log('Submitting answer :', params, initialParams);

      const onSuccess = res => {
        Voice.stop();
        if (res.data.valid_answer) {
          console.log('Valid answer received:', res.data);

          setInitialParams(res.data?.next_question_data);

          setUserData(res.data?.user_data);
          const newQuestion = res.data?.next_question_data?.question;
          setMessages(prev => [
            ...prev,
            { role: 'system', message: newQuestion },
          ]);
          Tts.speak(newQuestion);
        } else {
          setUserData(res?.data?.user_data);
          setMessages(prev => [
            ...prev,
            { role: 'system', message: res.data?.explanation },
          ]);
          Tts.speak(res.data?.explanation);
        }
      };
      Request('call-openai', 'POST', params, onSuccess, e => {
        console.log('Error:', e);
        setIsLoading(false);
      });
    },
    [initialParams, userData, conversationId, setInitialParams, setUserData],
  );

  // Update the ref whenever submitAnswer changes
  useEffect(() => {
    submitAnswerRef.current = submitAnswer;
  }, [submitAnswer]);
  // Track store changes with Reactotron

  const fetchQuestionList = () => {
    setIsLoading(true);
    const onSuccess = res => {
      setIsLoading(false);
      setInitialParams(res.data?.question);
      setUserData(res.data?.user_data);
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
        setTimeout(() => {
          Tts.speak(res.data?.question?.question);
          setMessages(prev => [
            ...prev,
            { role: 'system', message: res.data?.question?.question },
          ]);
        }, 2000);
      }
    };
    Request('questions', 'GET', {}, onSuccess, () => setIsLoading(false));
  };
  const fetchCategories = () => {
    const onSuccess = res => {
      setCategories(res.data?.categoryList || []);
    };
    Request('metadata', 'GET', {}, onSuccess, () => {});
  };
  useEffect(() => {
    fetchConversation(category);
    return () => {};
  }, [category]);

  const fetchConversation = (id: any) => {
    if (!id) return;
    const onSuccess = res => {
      setConversation([...res.data]);
    };
    const params = { conversation_id: conversationId, categories: [id] };
    Request('conversation', 'POST', params, onSuccess, () => {});
  };
  useEffect(() => {
    fetchQuestionList();
    fetchCategories();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button onPress={() => setType(1)} title="View Conversation" />
        <Button onPress={() => setType(2)} title="View Data" />
      </View>
      {type === 1 ? (
        <View style={{ height: '100%' }}>
          <Animated.FlatList
            ref={scrollRef}
            data={messages}
            style={{ height: '80%' }}
            keyExtractor={(item, index) => `message-${index}`}
            renderItem={({ item }) => {
              const isSystem = item.role === 'system';
              return (
                <View
                  style={[
                    styles.bubbleContainer,
                    isSystem && styles.systemBubble,
                  ]}
                >
                  <Animated.View
                    entering={isSystem ? FadeInLeft : FadeInRight}
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
                  </Animated.View>
                </View>
              );
            }}
            itemLayoutAnimation={CurvedTransition}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.sttButton]}
              onPress={handleSpeechToText}
            >
              <Text style={styles.buttonText}>
                {isListening ? 'Stop Listening' : 'Give Answer'}
              </Text>
              <Text style={styles.buttonSubText}>
                {isListening ? 'Listening...' : 'Tap to start recording'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ height: '100%' }}>
          <ScrollView
            horizontal
            contentContainerStyle={{
              padding: 10,
              height: 60,
            }}
          >
            {categories?.map((item, index) => {
              const isSelected = item.id === category;
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: isSelected ? '#ffff99' : '#e0f7fa',
                    padding: 10,
                    height: 40,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                  onPress={() => setCategory(item.id)}
                >
                  <Text style={{ fontSize: 16, color: '#333' }}>
                    {item.category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <ScrollView
            style={{ height: '90%' }}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <Conversation
              category={category}
              conversationId={conversationId}
              conversation={conversation}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    margin: 10,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
  },
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
    height: '25%',
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
