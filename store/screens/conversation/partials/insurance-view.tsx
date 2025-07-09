import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
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

const InsuranceView = (props: any) => {
  const { categories } = useAppStore();
  const { category } = props;
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategory = categories?.find(cat => cat.id === category);
  if (currentCategory?.category !== 'Insurance Detail') return null;

  const showImagePicker = (type: 'front' | 'back') => {
    Alert.alert('Select Image', 'Choose how you want to select the image', [
      {
        text: 'Camera',
        onPress: () => openCamera(type),
      },
      {
        text: 'Gallery',
        onPress: () => openGallery(type),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const openCamera = (type: 'front' | 'back') => {
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
        const imageUri = response.assets[0].uri;
        if (type === 'front') {
          setFrontImage(imageUri || null);
        } else {
          setBackImage(imageUri || null);
        }
      }
    });
  };

  const openGallery = (type: 'front' | 'back') => {
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
        const imageUri = response.assets[0].uri;
        if (type === 'front') {
          setFrontImage(imageUri || null);
        } else {
          setBackImage(imageUri || null);
        }
      }
    });
  };

  const submitImages = async () => {
    if (!frontImage || !backImage) {
      Alert.alert(
        'Error',
        'Please select both front and back images of your insurance',
      );
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    // Add front image
    formData.append('frontImage', {
      uri: frontImage,
      type: 'image/jpeg',
      name: 'insurance_front.jpg',
    } as any);

    // Add back image
    formData.append('backImage', {
      uri: backImage,
      type: 'image/jpeg',
      name: 'insurance_back.jpg',
    } as any);

    const onSuccess = (response: any) => {
      setIsSubmitting(false);
      Alert.alert('Success', 'Insurance images uploaded successfully!');
      console.log('Upload success:', response);
    };

    const onError = (error: string) => {
      setIsSubmitting(false);
      Alert.alert('Error', `Failed to upload images: ${error}`);
      console.error('Upload error:', error);
    };

    // Call the API - adjust endpoint as needed
    Request('upload-insurance', 'POST', formData, onSuccess, onError);
  };

  const canSubmit = frontImage && backImage && !isSubmitting;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Insurance Detail</Text>
      <Text style={styles.subtitle}>
        Please capture or select front and back images of your insurance card
      </Text>

      {/* Front Image Picker */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Front Side</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => showImagePicker('front')}
        >
          {frontImage ? (
            <Image source={{ uri: frontImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Tap to add front image</Text>
              <Text style={styles.placeholderSubtext}>
                📷 Camera or Gallery
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Back Image Picker */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Back Side</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => showImagePicker('back')}
        >
          {backImage ? (
            <Image source={{ uri: backImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Tap to add back image</Text>
              <Text style={styles.placeholderSubtext}>
                📷 Camera or Gallery
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
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
          {isSubmitting ? 'Uploading...' : 'Submit Insurance Images'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  imageSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  placeholderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
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

export default InsuranceView;
