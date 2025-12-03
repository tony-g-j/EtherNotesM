import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ConfigScreen from '../screens/Configuracion';
import RegisterScreen from '../screens/Registro';

const tabs = createBottomTabNavigator();

export default function Tabs() {
  return (
    <tabs.Navigator>
        <tabs.Screen name='1' component={ConfigScreen}/>
        <tabs.Screen name='2' component={RegisterScreen}/>
    </tabs.Navigator>
  );
}