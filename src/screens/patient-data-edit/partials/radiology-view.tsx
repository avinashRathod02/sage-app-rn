import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  FlatList
} from 'react-native'
import {useState} from 'react'
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType
} from 'react-native-image-picker'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

interface RadioImage {
  id: string
  uri: string
  name: string
}

const RadiologyView = (props: any) => {
  const {categories} = useSelector((state: RootState) => state.common)
  const {category, conversationId} = props
  const [images, setImages] = useState<RadioImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentCategory = categories?.find(cat => cat.id === category)
  if (currentCategory?.category !== 'Radiology') return null

  const showImagePicker = () => {
    if (images.length >= 10) {
      Alert.alert('Limit Reached', 'You can only add up to 10 Radiology images')
      return
    }

    Alert.alert('Add Radiology Image', 'Choose how you want to add the image', [
      {
        text: 'Camera',
        onPress: () => openCamera()
      },
      {
        text: 'Gallery',
        onPress: () => openGallery()
      },
      {
        text: 'Cancel',
        style: 'cancel'
      }
    ])
  }

  const openCamera = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as any,
      maxWidth: 1000,
      maxHeight: 1000
    }

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera picker')
        return
      }

      if (response.errorMessage) {
        console.error('Camera Error: ', response.errorMessage)
        Alert.alert('Camera Error', response.errorMessage)
        return
      }
      console.log('responshhhe', response)

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0]
        const newImage: RadioImage = {
          id: Date.now().toString(),
          uri: asset.uri || '',
          name: asset.fileName || `radiology_${Date.now()}.jpg`
        }
        setImages(prev => [...prev, newImage])
      }
    })
  }

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as any,
      maxWidth: 1000,
      maxHeight: 1000
    }

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      console.log('responshhhe', response)

      if (response.didCancel) {
        console.log('User cancelled gallery picker')
        return
      }

      if (response.errorMessage) {
        console.error('Gallery Error: ', response.errorMessage)
        Alert.alert('Gallery Error', response.errorMessage)
        return
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0]
        const newImage: RadioImage = {
          id: Date.now().toString(),
          ...asset,
          path: asset.uri,

          name: asset.fileName || `radiology_${Date.now()}.jpg`
        }
        setImages(prev => [...prev, newImage])
      }
    })
  }

  const removeImage = (id: string) => {
    Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setImages(prev => prev.filter(img => img.id !== id))
        }
      }
    ])
  }

  const createFormData = (images, body = {}) => {
    const data = new FormData()

    images.forEach(image => {
      data.append('xray_images', {
        uri: image.uri,
        type: 'image/jpeg',
        name: image.name
      } as any)
    })

    Object.keys(body).forEach(key => {
      data.append(key, body[key])
    })

    return data
  }

  const submitImages = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please add at least one Radiology image')
      return
    }

    console.log('ddd')

    try {
      await fetch(`${BASE_URL}upload-xray`, {
        method: 'POST',
        body: createFormData(images, {conversation_id: conversationId}),
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json'
        }
      })
        .then(response => response.json())
        .then(res => console.log(res))
        .catch(err => console.error(err))
    } catch (error) {
      console.error('❌ Upload failed:', error)
      throw error
    }
  }

  const canSubmit = images.length > 0 && images.length <= 10 && !isSubmitting

  const renderImageItem = ({item}: {item: RadioImage}) => (
    <View style={styles.imageItem}>
      <Image source={{uri: item.uri}} style={styles.imagePreview} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(item.id)}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  )

  const renderAddButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={showImagePicker}
      disabled={images.length >= 10}>
      <Text style={styles.addButtonText}>+</Text>
      <Text style={styles.addButtonSubtext}>Add Image</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Radiology Images</Text>
      <Text style={styles.subtitle}>
        Add Radiology images (minimum 1, maximum 10)
      </Text>
      <Text style={styles.counter}>{images.length}/10 images added</Text>

      <View style={styles.imageGrid}>
        <FlatList
          data={[...images, {id: 'add-button'}]}
          renderItem={({item}) => {
            if (item.id === 'add-button') {
              return images.length < 10 ? renderAddButton() : null
            }
            return renderImageItem({item: item as RadioImage})
          }}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={submitImages}
        disabled={!canSubmit}>
        <Text
          style={[
            styles.submitButtonText,
            !canSubmit && styles.submitButtonTextDisabled
          ]}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
    lineHeight: 22
  },
  counter: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#888',
    fontWeight: '500'
  },
  imageGrid: {
    flex: 1,
    marginBottom: 20
  },
  gridContainer: {
    paddingBottom: 20
  },
  imageItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84
  },
  imagePreview: {
    width: '100%',
    height: 120,
    resizeMode: 'cover'
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  addButton: {
    flex: 1,
    margin: 8,
    height: 120,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    fontSize: 32,
    color: '#007AFF',
    marginBottom: 4
  },
  addButtonSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  submitButtonTextDisabled: {
    color: '#999'
  }
})

export default RadiologyView
