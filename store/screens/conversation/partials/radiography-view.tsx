import { View, Text } from 'react-native';
import React from 'react';
import { useAppStore } from '../../../appStore';

const RadiographyView = (props: any) => {
  const { categories } = useAppStore();
  const { category } = props;
  const currentCategory = categories?.find(cat => cat.id === category);
  if (currentCategory?.category !== 'Radiography') return null;
  return (
    <View>
      <Text>RadiographyView</Text>
    </View>
  );
};

export default RadiographyView;
