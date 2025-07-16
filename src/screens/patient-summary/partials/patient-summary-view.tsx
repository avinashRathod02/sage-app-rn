import {View, Text, StyleSheet} from 'react-native'
import colors from 'theme'

export default ({conversation = []}) => {
  if (!conversation.length) return
  const uniqueConversation = conversation.filter((item, index, array) => {
    const lastIndex = array
      .map(obj => obj.question_title)
      .lastIndexOf(item.question_title)
    return index === lastIndex
  })
  return (
    <View
      style={styles.container}
      className="flex-1 p-4 bg-white rounded-md mt-2 mb-12 mx-3">
      {uniqueConversation.map((item, index) => {
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
  container: {
    width: '95%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10
  },
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ccc'
  },
  itemTitle: {
    fontSize: 16,
    color: colors.primary
  },
  itemAnswer: {
    color: '#333'
  }
})
