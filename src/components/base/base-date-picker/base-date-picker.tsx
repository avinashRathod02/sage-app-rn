import {useState} from 'react'
import {Platform, View, Text, Pressable, Modal} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

interface BaseDatePickerProps {
  value: Date | null
  setValue: (date: Date) => void
  placeholder?: string
  mode?: 'date' | 'time' | 'datetime'
  minimumDate?: Date
  maximumDate?: Date
}

const BaseDatePicker: React.FC<BaseDatePickerProps> = ({
  value,
  setValue,
  placeholder = 'Select date',
  mode = 'date',
  minimumDate,
  maximumDate
}) => {
  const [show, setShow] = useState(false)

  const onChange = (_: any, selectedDate?: Date) => {
    setShow(false)
    if (selectedDate) {
      setValue(selectedDate)
    }
  }

  const formattedValue = value ? moment(value).format('YYYY-MM-DD') : ''

  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        style={{padding: 12, borderWidth: 1, borderRadius: 6}}>
        <Text style={{color: formattedValue ? '#000' : '#999'}}>
          {formattedValue || placeholder}
        </Text>
      </Pressable>

      {show && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: '#00000066'
            }}>
            <View style={{backgroundColor: '#fff', padding: 16}}>
              <DateTimePicker
                value={value || new Date()}
                mode={mode}
                display="spinner"
                onChange={onChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
              />
              <Pressable
                onPress={() => setShow(false)}
                style={{marginTop: 10, alignSelf: 'flex-end'}}>
                <Text style={{color: 'blue'}}>Done</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display="default"
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  )
}

export default BaseDatePicker
