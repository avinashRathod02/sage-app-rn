import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import { useAppStore } from '../../../appStore';
import { Request } from '../../../../apiRequest';

interface RadioImage {
  id: string;
  uri: string;
  name: string;
}

const RadiographyView = (props: any) => {
  const { categories } = useAppStore();
  const { category } = props;
  const [images, setImages] = useState<RadioImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategory = categories?.find(cat => cat.id === category);
  if (currentCategory?.category !== 'Radiography') return null;

  const showImagePicker = () => {
    if (images.length >= 10) {
      Alert.alert(
        'Limit Reached',
        'You can only add up to 10 radiography images',
      );
      return;
    }

    Alert.alert(
      'Add Radiography Image',
      'Choose how you want to add the image',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as any,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
        return;
      }

      if (response.errorMessage) {
        console.error('Camera Error: ', response.errorMessage);
        Alert.alert('Camera Error', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const newImage: RadioImage = {
          id: Date.now().toString(),
          uri: asset.uri || '',
          name: asset.fileName || `radiography_${Date.now()}.jpg`,
        };
        setImages(prev => [...prev, newImage]);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as any,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled gallery picker');
        return;
      }

      if (response.errorMessage) {
        console.error('Gallery Error: ', response.errorMessage);
        Alert.alert('Gallery Error', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const newImage: RadioImage = {
          id: Date.now().toString(),
          uri: asset.uri || '',
          name: asset.fileName || `radiography_${Date.now()}.jpg`,
        };
        setImages(prev => [...prev, newImage]);
      }
    });
  };

  const removeImage = (id: string) => {
    Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setImages(prev => prev.filter(img => img.id !== id));
        },
      },
    ]);
  };

  const submitImages = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please add at least one radiography image');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    // Add all images to form data
    images.forEach(image => {
      formData.append('radiographyImages', {
        uri: image.uri,
        type: 'image/jpeg',
        name: image.name,
      } as any);
    });

    // Add metadata
    formData.append('imageCount', images.length.toString());

    const onSuccess = (response: any) => {
      setIsSubmitting(false);
      Alert.alert(
        'Success',
        `Successfully uploaded ${images.length} radiography images!`,
      );
      console.log('Upload success:', response);
      // Optionally clear images after successful upload
      // setImages([]);
    };

    const onError = (error: string) => {
      setIsSubmitting(false);
      Alert.alert('Error', `Failed to upload images: ${error}`);
      console.error('Upload error:', error);
    };

    // Call the API
    Request('upload-radiography', 'POST', formData, onSuccess, onError);
  };

  const canSubmit = images.length > 0 && images.length <= 10 && !isSubmitting;

  const renderImageItem = ({ item }: { item: RadioImage }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.uri }} style={styles.imagePreview} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(item.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={showImagePicker}
      disabled={images.length >= 10}
    >
      <Text style={styles.addButtonText}>+</Text>
      <Text style={styles.addButtonSubtext}>Add Image</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Radiography Images</Text>
      <Text style={styles.subtitle}>
        Add radiography images (minimum 1, maximum 10)
      </Text>
      <Text style={styles.counter}>{images.length}/10 images added</Text>

      <View style={styles.imageGrid}>
        <FlatList
          data={[...images, { id: 'add-button' }]}
          renderItem={({ item }) => {
            if (item.id === 'add-button') {
              return images.length < 10 ? renderAddButton() : null;
            }
            return renderImageItem({ item: item as RadioImage });
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
        disabled={!canSubmit}
      >
        <Text
          style={[
            styles.submitButtonText,
            !canSubmit && styles.submitButtonTextDisabled,
          ]}
        >
          {isSubmitting
            ? 'Uploading...'
            : `Submit ${images.length} Image${images.length !== 1 ? 's' : ''}`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.submitButton2]}
        onPress={submitImages}
        disabled={!canSubmit}
      >
        <Text style={[styles.submitButtonText]}>{'Analyze'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
    lineHeight: 22,
  },
  counter: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#888',
    fontWeight: '500',
  },
  imageGrid: {
    flex: 1,
    marginBottom: 20,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  imageItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  imagePreview: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
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
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    flex: 1,
    margin: 8,
    height: 120,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 32,
    color: '#007AFF',
    marginBottom: 4,
  },
  addButtonSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButton2: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
});

export default RadiographyView;
