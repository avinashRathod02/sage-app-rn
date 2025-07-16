import {KeyboardAvoidingView, ScrollView, View} from 'react-native'
import ConversationDataView from './partials/patient-summary-view'
import InsuranceView from './partials/insurance-view'
import RadiologyView from './partials/radiology-view'
import {BaseImage} from 'components'
import {useEffect, useState} from 'react'
import {Request} from 'utils/request'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {setCategories} from 'store/common/slice'
import {Categories} from './partials/categories'
import {Header} from 'components/header'
import {useRoute} from '@react-navigation/native'

export const PatientDataEdit = () => {
  const params = useRoute().params
  const {conversationId} = useSelector((state: RootState) => state.common)
  const dispatch = useDispatch()
  const [category, setCategory] = useState(0)
  const [conversation, setConversation] = useState([])
  const fetchCategories = () => {
    const onSuccess = res => {
      if (res.data?.categoryList) {
        dispatch(setCategories(res.data?.categoryList || []))
        setCategory(res.data?.categoryList[0]?.id)
      }
    }
    Request('metadata', 'GET', {}, onSuccess, () => {})
  }
  useEffect(() => {
    if (!conversationId) return
    fetchConversation(category)
    return () => {}
  }, [category])
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchConversation = (id: any) => {
    if (!id) return
    const onSuccess = res => {
      setConversation([...res.data])
    }
    const params = {conversation_id: conversationId, categories: [id]}
    Request('conversation', 'POST', params, onSuccess, () => {})
  }
  const props = {
    category,
    setCategory,
    conversation
  }
  return (
    <View className="flex-1 items-center justify-around bg-white">
      <BaseImage type="Image" className="w-full h-full absolute" name="BG" />
      <Header
        showLines={false}
        showBack
        title={params?.title ?? 'Patient Demographic'}
      />
      <KeyboardAvoidingView
        contentContainerStyle={{flex: 1, width: '100%', alignItems: 'center'}}
        style={{width: '100%', flex: 1}}
        behavior="padding">
        <ScrollView style={{width: '100%'}}>
          <ConversationDataView {...props} />
          <InsuranceView {...props} />
          <RadiologyView {...props} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
