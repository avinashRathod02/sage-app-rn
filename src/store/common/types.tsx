export interface IInitialCommonStateProps {
  initialParams: InitialParams | null
  userData: any // Assuming userData is of type any, adjust as needed
  categories?: CategoryId[] // Optional categories array
}

type CategoryId = {
  id: string
  category: string
}
interface InitialParams {
  question_prompt?: string
  question?: string
  categories?: CategoryId[] // Assuming categories is an array of strings
  user_data?: any
  [key: string]: any
}
