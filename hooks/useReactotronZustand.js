import { useAppStore } from './store/appStore';
import { useEffect } from 'react';
import Reactotron from 'reactotron-react-native';

// Custom hook to integrate Zustand with Reactotron
export const useReactotronZustand = () => {
  const store = useAppStore();
  
  useEffect(() => {
    // Send store state to Reactotron whenever it changes
    const unsubscribe = useAppStore.subscribe((state) => {
      Reactotron.display({
        name: 'Zustand Store Update',
        preview: 'Store state changed',
        value: state,
      });
    });

    // Send initial state
    Reactotron.display({
      name: 'Zustand Initial State',
      preview: 'Initial store state',
      value: store,
    });

    return unsubscribe;
  }, [store]);

  return store;
};
