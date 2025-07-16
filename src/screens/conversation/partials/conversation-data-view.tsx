import {BaseInput, BasePicker} from 'components'
import BaseDatePicker from 'components/base/base-date-picker/base-date-picker'
import {View, Text, StyleSheet} from 'react-native'
import {GENDER_OPTIONS} from 'store/common/helper'

export default ({conversation = []}) => {
  if (!conversation.length) return
  return (
    <View
      style={styles.container}
      className="flex-1 p-4 bg-white rounded-md mt-2 mb-12 mx-3">
      {conversation.map((item, index) => {
        if (item.type === 'textfield') {
          return (
            <BaseInput
              label={item.question_title}
              value={item?.extracted_answer}
              key={index}
            />
          )
        }
        if (item.type === 'textarea') {
          return (
            <BaseInput
              multiline
              style={{height: 100}}
              label={item.question_title}
              value={item?.extracted_answer}
              key={index}
            />
          )
        }
        if (item.type === 'date') {
          return (
            <BaseDatePicker
              label={item.question_title}
              value={item?.extracted_answer}
              key={index}
            />
          )
        }
        if (item.type === 'dropdown' && item.question_title === 'Gender') {
          return (
            <BasePicker
              label={item.question_title}
              value={item?.extracted_answer}
              key={index}
              // setValue={setCarVariant}
              items={GENDER_OPTIONS}
            />
          )
        }
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
