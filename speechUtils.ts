import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';

// Initialize TTS settings
Tts.setDefaultLanguage('en-US');
Tts.setDefaultRate(0.5);
Tts.setDefaultPitch(1.0);

/**
 * Text-to-Speech function
 * @param text - The text to be spoken
 * @param onSuccess - Callback function called when speech completes successfully
 * @param onCallback - Callback function called when speech fails (should be onError)
 */
export const textToSpeech = (
  text: string,
  onSuccess: () => void,
  onCallback: (error: any) => void,
): void => {
  // Remove any existing listeners to avoid conflicts
  Tts.removeAllListeners('tts-finish');
  Tts.removeAllListeners('tts-cancel');

  // Set up success listener
  Tts.addEventListener('tts-finish', () => {
    Tts.removeAllListeners('tts-finish');
    Tts.removeAllListeners('tts-cancel');
    onSuccess();
  });

  // Set up error/cancel listener
  Tts.addEventListener('tts-cancel', () => {
    Tts.removeAllListeners('tts-finish');
    Tts.removeAllListeners('tts-cancel');
    onCallback(new Error('Speech was cancelled'));
  });

  // Start speaking
  try {
    Tts.speak(text);
  } catch (error) {
    Tts.removeAllListeners('tts-finish');
    Tts.removeAllListeners('tts-cancel');
    onCallback(error);
  }
};

/**
 * Speech-to-Text function
 * @param onSuccess - Callback function called with recognized text when speech recognition succeeds
 * @param onFail - Callback function called when speech recognition fails
 */
export const speechToText = (
  onSuccess: (recognizedText: string) => void,
  onFail: (error: any) => void,
): void => {
  // Clean up any existing listeners
  Voice.destroy()
    .then(() => {
      // Set up event listeners
      Voice.onSpeechStart = () => {
        console.log('Speech recognition started');
      };

      Voice.onSpeechEnd = () => {
        console.log('Speech recognition ended');
      };

      Voice.onSpeechResults = (event: any) => {
        if (event.value && event.value.length > 0) {
          const recognizedText = event.value[0];
          // Clean up listeners
          Voice.destroy().then(Voice.removeAllListeners);
          onSuccess(recognizedText);
        } else {
          onFail(new Error('No speech recognized'));
        }
      };

      Voice.onSpeechError = (error: any) => {
        console.error('Speech recognition error:', error);
        // Clean up listeners
        Voice.destroy().then(Voice.removeAllListeners);
        onFail(error);
      };

      // Start listening
      Voice.start('en-US').catch(error => {
        onFail(error);
      });
    })
    .catch(error => {
      onFail(error);
    });
};
