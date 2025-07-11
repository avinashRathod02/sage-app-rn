import React from 'react'
import {StackActions, CommonActions} from '@react-navigation/native'
import {TransitionPresets} from '@react-navigation/stack'
import {routes} from './navigation-routes'

export const navigatorOptions = {
  animationEnabled: true,
  gestureEnabled: false,
  cardOverlayEnabled: false,
  //   gestureResponseDistance: SCREEN_WIDTH * 0.95,
  ...TransitionPresets.SlideFromRightIOS
}

export const navigatorOptions3 = {
  ...navigatorOptions,
  animationEnabled: false,
  gestureResponseDistance: 60
}
export const navigatorOptions2 = {
  ...navigatorOptions,
  gestureResponseDistance: 60
}

export const modalFadeTransition = {
  ...TransitionPresets.ModalFadeTransition
}

export const slideFromRightTransition = {
  ...TransitionPresets.SlideFromRightIOS
}

export let navigationRef: any = React.createRef()
export let navigationActionRef: any = null

export function navigateTo(route: any, params = {}) {
  navigationRef?.current?.navigate?.(route, params)
}

export function replaceTo(route: any, params = {}) {
  navigationRef?.current?.dispatch?.(StackActions.replace(route, params))
}

export function push(route: any, params = {}) {
  navigationRef?.current?.dispatch?.(StackActions.push(route, params))
}

export function resetNavigation(route: any, params = {}) {
  navigationRef?.current?.dispatch?.(
    StackActions.replace(route ?? routes.MAIN_BOTTOM_TAB, params)
  )
}

export function goBack() {
  navigationRef?.current?.goBack?.(null)
}

export function replace(route: any, params = {}) {
  navigationRef?.current?.dispatch?.(StackActions.replace(route, params))
}

export function setNavigationActionRef(ref: any) {
  navigationActionRef = ref
}

export function redirectToHomePage() {
  navigationActionRef?.redirectToHomePage?.()
}

export function redirectToLoginPage() {
  navigationActionRef?.redirectToLoginPage?.()
}

export const navigation = {
  navigateTo,
  goBack,
  replaceTo,
  replace,
  push,
  redirectToHomePage,
  redirectToLoginPage
}

export const dismissRoute = (routes: string[], callback = () => {}) => {
  navigationRef?.current?.dispatch?.((state: any) => {
    const filteredRoutes = state.routes.filter(
      (r: any) => !routes.includes(r.name)
    )

    return CommonActions.reset({
      ...state,
      routes: filteredRoutes,
      index: filteredRoutes.length - 1
    })
  })

  setTimeout(() => callback?.(), 100)
}
