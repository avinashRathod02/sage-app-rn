import {ScrollView, View} from 'react-native'
import {RootState} from 'store'
import {useSelector} from 'react-redux'
import {TabMenu} from 'components'

export const Categories = props => {
  const {categories} = useSelector((state: RootState) => state.common)
  const {setCategory, category} = props
  return (
    <View className="absolute top-28 w-full">
      <TabMenu
        value={category}
        setValue={setCategory}
        tabs={categories?.map(i => ({...i, title: i.category}))}
      />
    </View>
  )
}
