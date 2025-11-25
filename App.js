import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNav from './navigation/RootNav';


export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNav/>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
