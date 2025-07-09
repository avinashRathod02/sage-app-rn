import { View } from 'react-native';
import React from 'react';
import ConversationDataView from './partials/conversation-data-view';
import InsuranceView from './partials/insurance-view';
import RadiologyView from './partials/radiology-view';

export const Conversation = (props: any) => {
  return (
    <View>
      <ConversationDataView {...props} />
      <InsuranceView {...props} />
      <RadiologyView {...props} />
    </View>
  );
};
