import {Alert, StyleSheet, View} from 'react-native'
import {BaseImage, ButtonView, Text} from 'components'
import {useNavigation} from '@react-navigation/native'
import {routes} from 'navigation'
import Tts from 'react-native-tts'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {setInitialParams, updateMessages, setUserData} from 'store/common/slice'
import {Request} from 'utils/request'
import Animated, {
  CurvedTransition,
  FadeInLeft,
  FadeInRight
} from 'react-native-reanimated'
import Voice from '@react-native-voice/voice'

const Chat = () => {
  const scrollRef = useRef<Animated.FlatList>(null)
  const submitAnswerRef = useRef<((answer: string) => void) | null>(null)

  const dispatch = useDispatch()
  const {messages, userData, conversationId, initialParams} = useSelector(
    (state: RootState) => state.common
  )
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isAsking, setIsAsking] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')

  const speechToText = async () => {
    try {
      if (isListening) {
        await Voice.stop()
        setIsListening(false)
      } else {
        setRecognizedText('')
        await Voice.start('en-US')
      }
    } catch (error) {
      console.error('Voice start error:', error)
      Alert.alert('Error', 'Failed to start speech recognition')
      setIsListening(false)
    }
  }
  useEffect(() => {
    Tts.setDefaultLanguage('en-US')
    Tts.setDefaultPitch(1.0)
    Tts.addEventListener('tts-start', () => setIsSpeaking(true))
    Tts.addEventListener('tts-finish', () => {
      setIsSpeaking(false)
      if (isAsking) {
        setIsAsking(false)
      }
      speechToText()
    })
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false))
    return () => {
      Tts.removeAllListeners('tts-start')
      Tts.removeAllListeners('tts-finish')
      Tts.removeAllListeners('tts-cancel')
    }
  }, [])

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true)
    Voice.onSpeechEnd = () => setIsListening(false)
    Voice.onSpeechResults = event => {
      if (event.value && event.value.length > 0) {
        setRecognizedText(event.value[0])
        if (submitAnswerRef.current) {
          submitAnswerRef.current(event.value[0])
        }
      }
    }
    Voice.onSpeechError = error => {
      console.error('Speech recognition error:', error)
      setIsListening(false)
    }
    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  useEffect(() => {
    if (messages[0]) {
      setIsAsking(true)
      Tts.speak(messages[0].message)
    }
  }, [])
  function getPrompt(prompt, question, answer) {
    return prompt.replace('{question}', question).replace('{answer}', answer)
  }
  const submitAnswer = useCallback(
    (answer: string) => {
      if (submitting) return
      if (!initialParams) return
      const prompt = getPrompt(
        initialParams.question_prompt,
        initialParams.question,
        answer
      )
      const params = {
        ...initialParams,
        user_data: userData,
        conversation_id: conversationId,
        response: answer,
        prompt,
        is_third_try: 0
      }
      dispatch(updateMessages({role: 'user', message: answer}))
      scrollRef?.current?.scrollToEnd({animated: true})
      console.log('Submitting answer :', params, initialParams)

      const onSuccess = res => {
        Voice.stop()
        if (res.data.valid_answer) {
          console.log('Valid answer received:', res.data)

          dispatch(setInitialParams(res.data?.next_question_data))

          dispatch(setUserData(res.data?.user_data))
          const newQuestion = res.data?.next_question_data?.question
          dispatch(updateMessages({role: 'system', message: newQuestion}))
          setIsAsking(true)
          Tts.speak(newQuestion)
        } else {
          dispatch(setUserData(res?.data?.user_data))
          dispatch(
            updateMessages({role: 'system', message: res.data?.explanation})
          )
          Tts.speak(res.data?.explanation)
        }
      }
      Request('call-openai', 'POST', params, onSuccess, e => {
        console.log('Error:', e)
        setSubmitting(false)
      })
    },
    [initialParams, userData, conversationId]
  )

  useEffect(() => {
    submitAnswerRef.current = submitAnswer
  }, [submitAnswer])

  const navigation = useNavigation()
  const start = () => navigation.navigate(routes.CONVERSATION)
  return (
    <View className="flex-1 items-center justify-around bg-white">
      <BaseImage type="Image" className="w-full h-full absolute" name="BG" />
      <Animated.FlatList
        ref={scrollRef}
        data={messages}
        style={styles.list}
        keyExtractor={(item, index) => `message-${index}`}
        renderItem={({item}) => {
          const isSystem = item?.role === 'system'
          return (
            <View
              style={[styles.bubbleContainer, isSystem && styles.systemBubble]}>
              <Animated.View
                entering={isSystem ? FadeInLeft : FadeInRight}
                style={[
                  styles.bubble,
                  !isSystem && {backgroundColor: '#bae8e0'}
                ]}>
                <Animated.Text
                  layout={CurvedTransition}
                  style={{fontSize: 16, color: '#333'}}>
                  {item.message}
                </Animated.Text>
              </Animated.View>
            </View>
          )
        }}
        itemLayoutAnimation={CurvedTransition}
      />
      <ButtonView onPress={start} className="rounded-full overflow-hidden">
        <BaseImage
          name={isListening ? 'wave_animated' : 'wave'}
          style={{width: 100, height: 100}}
        />
      </ButtonView>
      <Text text={recognizedText} className="self-center" />
      <Text
        text={!isListening ? ' ' : 'Listening...'}
        className="self-center font-bold text-lg"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    maxHeight: '70%',
    width: '100%',
    marginTop: 40
  },
  bubbleContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end'
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  systemBubble: {
    justifyContent: 'flex-start'
  }
})

export default Chat
