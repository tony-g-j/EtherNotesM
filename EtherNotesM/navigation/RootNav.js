import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import InicioSesion from "../screens/InicioSesion";
import Registro from "../screens/Registro";
import Cuenta from "../screens/Cuenta";
import Profile from "../screens/Profile";
import Configuracion from "../screens/Configuracion";
import Principal from "../screens/Principal";
import NoteDetail from '../screens/NoteDetails';

const stack = createNativeStackNavigator();

export default function RootNav() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogginSucces = (usuario) => {
    console.log("Sesion iniciada", usuario.nombre);
    setCurrentUser(usuario);
  };

  const handleRegistroSuccess = (usuario) => {
    console.log("Registro exitoso para", usuario.nombre);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      {currentUser ? (
        <stack.Group>
          <stack.Screen name="Principal">
            {(props) => <Principal {...props} currentUserID={currentUser.id} />}
          </stack.Screen>
          <stack.Screen name="NoteDetail">
            {(props) => <NoteDetail {...props} />}
          </stack.Screen>
          <stack.Screen name="Cuenta">
            {(props) => (
              <Cuenta
                {...props}
                currentUserID={currentUser.id}
                onLogout={handleLogout}
              />
            )}
          </stack.Screen>
          <stack.Screen name="Profile">
            {(props) => <Profile {...props} currentUserID={currentUser.id} />}
          </stack.Screen>
          <stack.Screen name="Configuracion">
            {(props) => (
              <Configuracion
                {...props}
                currentUserID={currentUser.id}
                onLogout={handleLogout}
              />
            )}
          </stack.Screen>
        </stack.Group>
      ) : (
        <stack.Group>
          <stack.Screen name="Auth">
            {(props) => (
              <InicioSesion {...props} onLoginSuccess={handleLogginSucces} />
            )}
          </stack.Screen>
          <stack.Screen name="Registro" options={{ animationEnabled: true }}>
            {(props) => (
              <Registro {...props} onRegistroSuccess={handleRegistroSuccess} />
            )}
          </stack.Screen>
        </stack.Group>
      )}
    </stack.Navigator>
  );
}
