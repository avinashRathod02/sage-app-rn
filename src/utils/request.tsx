import axios, {AxiosStatic} from 'axios'
import {
  hasDifferentValues,
  hasObjectLength,
  hasTextLength
} from 'utils/condition'
import {routes} from '@/navigation'
import {resetNavigation} from '@/navigation/navigation-action'
import {persistor, store as reduxStore} from '@/store'
import {
  fetchUserCommonData,
  logout,
  setCacheUpdateTime,
  setSessionData
} from 'store/auth/slice'
import env from '@/config/config-api'
import {handleError} from './handle-error'
import {logAnalyticsEvent} from 'config/firebase/analytics'
import {setIsDemoUser} from 'store/demo/slice'
import {COMMON_DATA_ORIGIN} from 'constants/constants'

type MethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type IProps = {
  path?: string
  method?: MethodType
  header?: Record<string, any>
  data?: Record<string, any>
  axiosProps?: Partial<AxiosStatic>
  refreshToken?: boolean
  updateCommonData?: boolean
  returnFullResponse?: boolean
}

export interface IRequestOptions extends IProps {
  withFormData?: boolean
  throw_error?: boolean
}

export class Request {
  static get(path: string, options: IRequestOptions = {}) {
    return this.request({method: 'GET', path, ...options})
  }

  static post(
    path: string,
    data: Record<string, any>,
    options: IRequestOptions = {}
  ) {
    return this.request({method: 'POST', path, data, ...options})
  }

  static patch(
    path: string,
    data: Record<string, any>,
    options: IRequestOptions = {}
  ) {
    return this.request({method: 'PATCH', path, data, ...options})
  }

  static put(
    path: string,
    data: Record<string, any>,
    options: IRequestOptions = {}
  ) {
    return this.request({method: 'PUT', path, data, ...options})
  }

  static delete(
    path: string,
    data: Record<string, any>,
    options: IRequestOptions = {}
  ) {
    return this.request({method: 'DELETE', path, data, ...options})
  }

  static createFormData = (props: IRequestOptions) => {
    const {data, withFormData} = props
    if (!withFormData || !data) return JSON.stringify(data)

    const formData = new FormData()
    const appendFormData = (key: string, value: any) => {
      if (value instanceof File || typeof value === 'string') {
        formData.append(key, value)
      } else if (Array.isArray(value)) {
        value.forEach((val, index) => appendFormData(`${key}[${index}]`, val))
      } else if (typeof value === 'object' && value !== null) {
        Object.keys(value).forEach(subKey =>
          appendFormData(`${key}.${subKey}`, value[subKey])
        )
      } else {
        formData.append(key, String(value))
      }
    }

    Object.keys(data).forEach(key => appendFormData(key, data[key]))
    return formData
  }

  static async request(props: IRequestOptions) {
    const {
      path,
      method,
      header = {},
      axiosProps,
      returnFullResponse = false,
      throw_error = false,
      refreshToken = true,
      updateCommonData = true
    } = props
    const store = reduxStore.getState()
    const access_token = store.auth.sessionData?.access_token
    const cacheUpdateTime = store.auth.cacheUpdateTime
    const url = env.ENDPOINT_API + path

    // const {isConnected} = await NetInfo.fetch()
    // if (!isConnected) {
    // }

    const defaultHeader = {
      ...(hasTextLength(access_token) && {
        'client-id': access_token
      }),
      Authorization: `Bearer ${env.ANONYMOUS_TOKEN}`,
      Accept: 'application/json',
      ...header
    }

    const params = Request.createFormData(props)
    return axios({
      method,
      url,
      headers: defaultHeader,
      data: params,
      ...axiosProps
    })
      .then(response => {
        const {data} = response
        if (
          (!data.data &&
            !data.status &&
            data.hasOwnProperty('message') &&
            throw_error) ||
          (data && data.hasOwnProperty('error') && throw_error)
        ) {
          throw {response: {data: {...data, status: 422}}}
        }

        if (!hasObjectLength(cacheUpdateTime)) {
          reduxStore.dispatch(setCacheUpdateTime(data.cacheUpdateTime))
        }
        const isCommonDataRequest =
          response.config.url.includes('user/common-data/')
        if (data.cacheUpdateTime && !isCommonDataRequest) {
          const isDifferent = hasDifferentValues(
            cacheUpdateTime,
            data.cacheUpdateTime
          )

          console.log('==⏰ request.tsx() > IsTimeDiff', isDifferent)
          if (isDifferent) {
            console.log('===request.tsx() > Diff time checking start===')
            console.log('===Existing time', cacheUpdateTime)
            console.log('===New time', data.cacheUpdateTime)
            console.log('===request.tsx() > Diff time checking end===')
          }

          if (updateCommonData && isDifferent) {
            reduxStore.dispatch(
              fetchUserCommonData({origin: COMMON_DATA_ORIGIN.REQUEST_DIFF})
            )
          }
        } else {
          console.log(
            '🛑 request.tsx > request prevented for ',
            response.config.url
          )
        }
        if (returnFullResponse) return response
        return data
      })
      .catch(({response}) => {
        const status = response?.status
        if (status === 401) {
          if (!refreshToken) {
            reduxStore.dispatch({
              type: 'RESET_STATE',
              payload: () => {
                persistor.purge()
                reduxStore.dispatch(setIsDemoUser(true))
                reduxStore.dispatch(
                  logout(() => resetNavigation(routes.DEMO_USER))
                )
              }
            })
          }
          return refreshTokenApi({defaultHeader, prevRequest: props})
        }
        if (status === 404) {
          throw {
            response: {data: {message: 'Not Found', success: false, status}}
          }
        }
        if (response?.data?.toaster) {
          handleError(response)
        }
        // TODO: Handle redirect
        // if (response?.data?.redirect) {
        // navigateTo(response?.data?.redirect)
        // return
        // }
        throw response
      })
  }
}

const refreshTokenApi = async ({
  defaultHeader,
  prevRequest
}: {
  defaultHeader: Record<string, any>
  prevRequest: IRequestOptions
}): Promise<any> => {
  const store = reduxStore.getState()
  const refreshUri = env.ENDPOINT_API + '/refresh_token/'
  const refresh_token = store.auth.sessionData?.refresh_token
  const access_token = store.auth.sessionData?.access_token

  if (hasTextLength(access_token)) {
    defaultHeader['client-id'] = access_token
  }

  try {
    const refreshResponse = await axios({
      method: 'POST',
      url: refreshUri,
      headers: defaultHeader,
      data: {refresh_token}
    })

    if (refreshResponse.status === 200) {
      reduxStore.dispatch(setSessionData(refreshResponse.data.data))
      logAnalyticsEvent('refresh_token')
      console.log('♻️refreshTokenApi > refresh_token success ')
      const prevRequestResponse = await Request.request(prevRequest)
      console.log(
        '💭refreshTokenApi > prevRequestResponse',
        prevRequestResponse
      )
      return prevRequestResponse
    }
  } catch (error) {
    reduxStore.dispatch({
      type: 'RESET_STATE',
      payload: () => {
        persistor.purge()
        reduxStore.dispatch(logout(() => resetNavigation(routes.LOGIN)))
      }
    })
    throw error
  }
}
