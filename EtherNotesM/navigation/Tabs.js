import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Principal from '../screens/Principal';
import ConfigScreen from '../screens/Configuracion';
import RegisterScreen from '../screens/Registro';
import Cuenta from '../screens/Cuenta';
const tabs = createBottomTabNavigator();

export default function Tabs() {
  return (
    <tabs.Navigator>
        <tabs.Screen name='Principal' component={Principal}/>
        <tabs.Screen name='Registro' component={RegisterScreen}/>
        <tabs.Screen name='Cuenta' component={Cuenta} />
        <tabs.Screen name='configuracion' component={ConfigScreen}/>
    </tabs.Navigator>
  );
}
