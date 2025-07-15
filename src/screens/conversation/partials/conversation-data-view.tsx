import {View, Text, StyleSheet} from 'react-native'

export default ({
  conversation = []
}: {
  conversation: {question_title: string; extracted_answer: string}[]
}) => {
  if (!conversation.length) return
  return (
    <View>
      {/* Flatlist table  */}
      {conversation.map((item, index) => {
        return <ConversationItem key={index} item={item} />
      })}
    </View>
  )
}

export const ConversationItem = ({item}) => {
  if (item?.sub_category_data) {
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{item.sub_category}</Text>
        {item.sub_category_data.map((subItem, subIndex) => (
          <View key={subIndex} style={styles.subItemContainer}>
            <Text style={styles.subItemTitle}>{subItem.question_title}</Text>
            <Text style={styles.subItemAnswer}>
              - {subItem.extracted_answer}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.question_title}</Text>
      <Text style={styles.itemAnswer}>{item.extracted_answer}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  categoryContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  categoryTitle: {
    fontWeight: 'bold'
  },
  subItemContainer: {
    marginLeft: 15
  },
  subItemTitle: {
    fontWeight: '600'
  },
  subItemAnswer: {
    color: '#333'
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  itemAnswer: {
    color: '#333',
    marginTop: 4
  }
})
