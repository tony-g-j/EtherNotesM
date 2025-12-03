import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Loggin from '../screens/InicioSesion';
import Tabs from './Tabs'; 

const Stack = createNativeStackNavigator();

export default function RootNav() {
  return (
    <Stack.Navigator initialRouteName="loggin" screenOptions={{headerShown: false}}>
      
      <Stack.Screen 
        name="loggin" 
        component={Loggin} 
      />

      <Stack.Screen 
        name="Tabs" 
        component={Tabs}
      />

    </Stack.Navigator>
  );
}
