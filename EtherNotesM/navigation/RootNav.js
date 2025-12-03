import {createNativeStackNavigator} from '@react-navigation/native-stack';
import loggin from '../screens/InicioSesion';
import cuenta from '../screens/Cuenta';

const stack = createNativeStackNavigator();

export default function RootNav() {
  return (
    <stack.Navigator>
        <stack.Screen name='loggin' component={loggin} options={{headerShown: false}}/>
    </stack.Navigator>
  );
}