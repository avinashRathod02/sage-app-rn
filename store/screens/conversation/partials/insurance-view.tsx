import { View, Text } from 'react-native';
import React from 'react';
import { useAppStore } from '../../../appStore';

const InsuranceView = (props: any) => {
  const { categories } = useAppStore();
  const { category } = props;
  const currentCategory = categories?.find(cat => cat.id === category);
  if (currentCategory?.category !== 'Insurance Detail') return null;
  return (
    <View>
      <Text>InsuranceView</Text>
    </View>
  );
};

export default InsuranceView;
