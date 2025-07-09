import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
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

  // Form fields
  const [insurancePlanName, setInsurancePlanName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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
    // Validate all required fields
    if (!frontImage || !backImage) {
      Alert.alert(
        'Error',
        'Please select both front and back images of your insurance',
      );
      return;
    }

    if (!insurancePlanName.trim()) {
      Alert.alert('Error', 'Please enter the insurance plan name');
      return;
    }

    if (!memberId.trim()) {
      Alert.alert('Error', 'Please enter the member ID');
      return;
    }

    if (!groupNumber.trim()) {
      Alert.alert('Error', 'Please enter the group number');
      return;
    }

    if (!startDate) {
      Alert.alert('Error', 'Please select the start date');
      return;
    }

    if (!endDate) {
      Alert.alert('Error', 'Please select the end date');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    // Add form fields
    formData.append('insurance_plan_name', insurancePlanName);
    formData.append('member_id', memberId);
    formData.append('group_number', groupNumber);
    formData.append('start_date', startDate.toISOString().split('T')[0]);
    formData.append('end_date', endDate.toISOString().split('T')[0]);

    // Add front image
    formData.append('insurance_card_1', {
      uri: frontImage,
      type: 'image/jpeg',
      name: 'insurance_front.jpg',
    } as any);

    // Add back image
    formData.append('insurance_card_2', {
      uri: backImage,
      type: 'image/jpeg',
      name: 'insurance_back.jpg',
    } as any);

    const onSuccess = (response: any) => {
      setIsSubmitting(false);
      console.log('Upload success:', response);
    };

    const onError = (error: string) => {
      setIsSubmitting(false);
      console.error('Upload error:', error);
    };

    // Call the API
    Request('store-openemr', 'POST', formData, onSuccess, onError);
  };

  const canSubmit =
    frontImage &&
    backImage &&
    insurancePlanName.trim() &&
    memberId.trim() &&
    groupNumber.trim() &&
    startDate &&
    endDate &&
    !isSubmitting;

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

      {/* Form Fields */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Insurance Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Insurance Plan Name *</Text>
          <TextInput
            style={styles.textInput}
            value={insurancePlanName}
            onChangeText={setInsurancePlanName}
            placeholder="Enter insurance plan name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Member ID *</Text>
          <TextInput
            style={styles.textInput}
            value={memberId}
            onChangeText={setMemberId}
            placeholder="Enter member ID"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Group Number *</Text>
          <TextInput
            style={styles.textInput}
            value={groupNumber}
            onChangeText={setGroupNumber}
            placeholder="Enter group number"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Start Date *</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text
              style={[
                styles.datePickerText,
                !startDate && styles.placeholderText,
              ]}
            >
              {startDate ? startDate.toLocaleDateString() : 'Select start date'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>End Date *</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text
              style={[
                styles.datePickerText,
                !endDate && styles.placeholderText,
              ]}
            >
              {endDate ? endDate.toLocaleDateString() : 'Select end date'}
            </Text>
          </TouchableOpacity>
        </View>
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
          {isSubmitting ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={showStartDatePicker}
        date={startDate || new Date()}
        mode="date"
        onConfirm={date => {
          setShowStartDatePicker(false);
          setStartDate(date);
        }}
        onCancel={() => {
          setShowStartDatePicker(false);
        }}
      />

      <DatePicker
        modal
        open={showEndDatePicker}
        date={endDate || new Date()}
        mode="date"
        onConfirm={date => {
          setShowEndDatePicker(false);
          setEndDate(date);
        }}
        onCancel={() => {
          setShowEndDatePicker(false);
        }}
      />
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
  formSection: {
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
});

export default InsuranceView;
