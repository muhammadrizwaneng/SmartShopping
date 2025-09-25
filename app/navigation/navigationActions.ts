import NavigationService from '../navigation/NavigationService';

export function reset() {
  NavigationService.reset();
}

export function navigateToWelcome(params: any) {
  NavigationService.navigate('Welcome', params);
}

export function navigateToScreen(params: any) {
  NavigationService.navigate(params, '');
}

export function navigateTo(screenName: string, params: any) {
  NavigationService.navigate(screenName, params);
}
