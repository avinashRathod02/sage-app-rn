import {useEffect, useRef, useState} from 'react'
import {View, StyleSheet, Animated, Easing} from 'react-native'

// Extended to include both alphabet letters and numbers
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
const MAX_DURATION = 5000 // 5 seconds for the entire animation

export const RollingText = ({text, onComplete}) => {
  const [displayedText, setDisplayedText] = useState([])
  const animationRefs = useRef([])

  useEffect(() => {
    // Initialize displayedText and animationRefs when text changes
    setDisplayedText(new Array(text.length).fill('A'))
    animationRefs.current = new Array(text.length)
      .fill(0)
      .map(() => new Animated.Value(0))

    startRollingAnimation()
  }, [text])

  const startRollingAnimation = () => {
    // Calculate total duration per character based on the maximum allowed duration
    const durationPerCharacter = MAX_DURATION / text.length
    let completedCount = 0 // To track the number of completed animations

    text.split('').forEach((targetCharacter, index) => {
      animateCharacter(
        targetCharacter.toUpperCase(),
        index,
        durationPerCharacter,
        () => {
          completedCount += 1
          // Check if all characters have completed their animation
          if (completedCount === text.length && onComplete) {
            onComplete() // Call the onComplete callback
          }
        }
      )
    })
  }

  const animateCharacter = (
    targetCharacter,
    index,
    duration,
    onCharacterComplete
  ) => {
    const targetIndex = characters.indexOf(targetCharacter)
    let currentIndex = 0

    const animateStep = () => {
      const nextCharacter = characters[currentIndex % characters.length]
      setDisplayedText(prev => {
        const updatedText = [...prev]
        updatedText[index] = nextCharacter
        return updatedText
      })

      if (nextCharacter === targetCharacter) {
        onCharacterComplete() // Call the completion handler for this character
        return
      }

      currentIndex++

      Animated.timing(animationRefs.current[index], {
        toValue: 1,
        duration: duration / characters.length, // Adjust duration to account for characters array
        easing: Easing.linear,
        useNativeDriver: false
      }).start(() => animateStep())
    }

    animateStep()
  }

  return (
    <View style={styles.container}>
      {displayedText.map((character, index) => (
        <Animated.Text key={index} style={styles.character}>
          {character}
        </Animated.Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  character: {
    fontWeight: 'bold',
    marginHorizontal: 5
  }
})
