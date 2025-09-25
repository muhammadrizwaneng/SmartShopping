import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider as PaperProvider } from 'react-native-paper';
import Navigator from '../navigation/index';
import { Text } from 'react-native';

const RootNavigation: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <PaperProvider>
          <Navigator />
        </PaperProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
};
export default RootNavigation;
