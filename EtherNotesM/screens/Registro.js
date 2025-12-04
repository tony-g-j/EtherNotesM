import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";
import { useState } from "react";
import Svg, { Path } from "react-native-svg";
import UsuarioController from "../controllers/UsuarioController";

const { width, height } = Dimensions.get("window");

const UserController = new UsuarioController();

export default function Registro({ navigation, onRegistroSuccess }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmContraseña, setConfirmContraseña] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validarFormulario = () => {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (!correo.trim() || !correo.includes("@")) {
      setError("Ingresa un correo válido");
      return false;
    }
    if (contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (contraseña !== confirmContraseña) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleRegistro = async () => {
    setError("");

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const result = await UserController.createUser(
        nombre,
        correo,
        contraseña
      );

      if (result.success) {
        Alert.alert("Éxito", "Cuenta creada exitosamente");
        onRegistroSuccess(result.user);
      } else {
        setError(result.message);
        Alert.alert("Error de registro", result.message);
      }
    } catch (err) {
      const errorMsg = "Error al registrar: " + err.message;
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerRegistro}>
      <View style={styles.disenoSuperior}>
        <Svg width={412} height={200} fill="none">
          <Path
            fill="#191A2C"
            d="M0 0h412v150.242s-53.5 111.955-206 0c-152.5-111.954-206 0-206 0V0Z"
          />
        </Svg>
      </View>

      <Text style={styles.titulo}>Crear Cuenta</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#191A2C"
        value={nombre}
        onChangeText={setNombre}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#191A2C"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#191A2C"
        secureTextEntry={true}
        value={contraseña}
        onChangeText={setContraseña}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#191A2C"
        secureTextEntry={true}
        value={confirmContraseña}
        onChangeText={setConfirmContraseña}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono (opcional)"
        placeholderTextColor="#191A2C"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.botonRegistro, loading && styles.botonDisabled]}
        onPress={handleRegistro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.botonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </TouchableOpacity>

      <View style={styles.disenoInferior}>
        <Svg width={412} height={199} fill="none">
          <Path
            fill="#191A2C"
            d="M0 48.122s53 108.274 206 0 206 0 206 0V200H0V48.122Z"
          />
        </Svg>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerRegistro: {
    flexGrow: 1,
    backgroundColor: "#1B2D45",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  disenoSuperior: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },

  disenoInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
    alignSelf: "center",
    color: "#ffff",
    zIndex: 10,
  },

  input: {
    width: "80%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    fontFamily: "Montserrat",
    zIndex: 10,
  },

  botonRegistro: {
    width: "70%",
    height: height * 0.05,
    backgroundColor: "#191A2C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    zIndex: 10,
  },

  botonDisabled: {
    opacity: 0.6,
  },

  botonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  linkText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    zIndex: 10,
  },

  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
    zIndex: 10,
  },
});
