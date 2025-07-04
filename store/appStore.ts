import { create } from 'zustand';
type CategoryId = {
  id: string;
  category: string;
};
interface InitialParams {
  question_prompt?: string;
  question?: string;
  categories?: CategoryId[]; // Assuming categories is an array of strings
  user_data?: any;
  [key: string]: any;
}

interface AppState {
  initialParams: InitialParams | null;
  userData: any; // Assuming userData is of type any, adjust as needed
  categories?: CategoryId[]; // Optional categories array
  setCategories: (categories: CategoryId[]) => void; // Function to set categories
  setUserData: (data: any) => void; // Function to set userData
  setInitialParams: (params: InitialParams | null) => void;
  updateInitialParams: (params: Partial<InitialParams>) => void;
}

export const useAppStore = create<AppState>(set => ({
  initialParams: null,
  userData: null,
  categories: [],
  setCategories: (categories: CategoryId[]) => set({ categories }),
  setUserData: data => set({ userData: data }),
  setInitialParams: params => set({ initialParams: params }),
  updateInitialParams: params =>
    set(state => ({
      initialParams: state.initialParams
        ? { ...state.initialParams, ...params }
        : params,
    })),
}));
