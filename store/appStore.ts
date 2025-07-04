import { create } from 'zustand';

interface InitialParams {
  question_prompt?: string;
  question?: string;
  user_data?: any;
  [key: string]: any;
}

interface AppState {
  initialParams: InitialParams | null;
  setInitialParams: (params: InitialParams | null) => void;
  updateInitialParams: (params: Partial<InitialParams>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  initialParams: null,
  setInitialParams: (params) => set({ initialParams: params }),
  updateInitialParams: (params) => set((state) => ({ 
    initialParams: state.initialParams ? { ...state.initialParams, ...params } : params
  })),
}));
