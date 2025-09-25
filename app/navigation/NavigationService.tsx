import { NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = React.createRef<NavigationContainerRef>();
function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}
function goBack() {
  navigationRef.current?.goBack();
}

function reset() {
  navigationRef.current?.reset({ index: 0, routes: [{ name: 'Discover' }] });
}
export default {
  navigate,
  goBack,
  reset,
};
