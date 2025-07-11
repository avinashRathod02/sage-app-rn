import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import env from 'config/config-api'
import InAppReview from 'react-native-in-app-review'
import {isAndroidPlatform, isIosPlatform} from './platform'
import {showToastMessage} from 'components/toast'
import moment from 'moment'
import {
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform
} from 'react-native'
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions'
import FileViewer from 'react-native-file-viewer'
import {hasValue, isBooleanTrue} from './condition'
import DeviceInfo from 'react-native-device-info'
import {haptic} from './vibrate'
import notifee, {AuthorizationStatus} from '@notifee/react-native'

const {DownloadHelper} = NativeModules

export const appFolder = isAndroidPlatform
  ? `${RNFetchBlob.fs.dirs.DownloadDir}/SStudyApp/`
  : `${RNFS.DownloadDirectoryPath}/SStudyApp/`

export const savePDF = async (
  uri: string,
  fileName: string,
  loader?: (loading: boolean) => void,
  onSuccess?: () => void
) => {
  try {
    loader?.(true)

    await DownloadHelper.downloadFile(uri, fileName)

    showToastMessage({
      message: 'Download started!',
      type: 'success'
    })

    onSuccess?.()
  } catch (err: any) {
    showToastMessage({
      message: err?.message || 'Failed to download PDF',
      type: 'error'
    })
  } finally {
    loader?.(false)
  }
}
export const viewPdf = async (fileName: string) => {
  const fullPath = isAndroidPlatform
    ? `file://${appFolder}${fileName}`
    : `${appFolder}${fileName}`
  await FileViewer.open(fullPath, {showOpenWithDialog: true})
}
export const downloadPdf = async (
  link: string,
  fileName: string,
  loader?: (loading: boolean) => void,
  onSuccess?: (res: any) => void
) => {
  if (!link) return
  try {
    const permissionGranted = await requestStoragePermission()
    if (!permissionGranted) {
      showToastMessage({message: 'Permission denied', type: 'error'})
      loader?.(false)
      return
    }
    const fullPath = `/SStudyApp/${fileName}`
    const directoryExists = await RNFetchBlob.fs.exists(appFolder)

    if (isAndroidPlatform) {
      if (!directoryExists) {
        RNFetchBlob.fs.mkdir(appFolder).then(res => {
          if (isBooleanTrue(res)) {
            savePDF(link, fullPath, loader, onSuccess)
          } else {
            showToastMessage({
              message: 'Failed to create directory',
              type: 'error'
            })
            loader?.(false)
          }
        })
      } else {
        await savePDF(link, fullPath, loader, onSuccess)
      }
    } else {
      const saveIos = async () => {
        loader?.(true)
        const downloadRes = await RNFS.downloadFile({
          fromUrl: link,
          toFile: fullPath
        }).promise

        if (downloadRes.statusCode === 200) {
          showToastMessage({
            message: 'PDF saved successfully',
            type: 'success'
          })
        } else {
          showToastMessage({
            message: 'Failed to download PDF',
            type: 'error'
          })
        }

        loader?.(false)
      }
      if (!directoryExists) {
        const create = await RNFS.mkdir(appFolder)
        if (create) await saveIos()
      } else {
        await saveIos()
      }
    }
  } catch (error) {
    console.log('Error downloading PDF:', error)

    loader?.(false)
    showToastMessage({
      message: 'Failed to download PDF',
      type: 'error'
    })
  }
}

export const requestStoragePermission = async () => {
  try {
    if (isAndroidPlatform) {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      const hasPermission = await PermissionsAndroid.check(permission)

      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission Required',
          message:
            'This app needs access to your storage to save photos to your gallery.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Okay'
        })
        if (Platform.Version < 33) return true
        return granted
      }
      return true
    } else {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
      return result === RESULTS.GRANTED
    }
  } catch (error) {}
}

export const isPDFExist = async (fileName: string) => {
  try {
    const fullPath = appFolder + fileName
    const exists = await RNFS.exists(fullPath)
    return exists
  } catch (error) {
    console.error('Error checking file existence:', error)
    return false
  }
}

export const requiredField = (v: string, field = 'This field') => {
  if (!hasValue(v)) {
    return `${field} is required.`
  }
  return ''
}

export const getDeviceDescription = async (
  isInStrFormat: boolean = true
): Promise<string | object> => {
  const systemName = isIosPlatform ? 'iOS' : 'Android'
  const systemVersion = DeviceInfo.getSystemVersion()
  const brand = DeviceInfo.getBrand()
  const deviceName = await DeviceInfo.getDeviceName()
  const model = DeviceInfo.getModel()

  if (isInStrFormat) {
    return `${systemName} ${systemVersion}, ${brand}, ${deviceName} (${model})`
  }

  const data = {systemName, systemVersion, brand, deviceName, model}
  return data
}

export const rateApp = () => {
  try {
    const isAvailable = InAppReview.isAvailable()
    if (isAvailable) {
      haptic()
      const startTime = moment()
      const timeLimit = 1000
      InAppReview.RequestInAppReview().then(d => {
        if (d) {
          const responseTime = moment().diff(startTime)
          if (responseTime <= timeLimit) {
            Linking.openURL(env.APP_LINK)
          }
        }
      })
    } else {
      Linking.openURL(env.APP_LINK)
    }
  } catch (error) {}
}

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission({
    sound: false,
    announcement: true,
    inAppNotificationSettings: false
  })

  if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    return false
  } else if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    return true
  } else if (settings.authorizationStatus === AuthorizationStatus.PROVISIONAL) {
    return true
  }
}
