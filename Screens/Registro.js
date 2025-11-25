import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topWave} />
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Registro De Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#666"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Contrasena"
          placeholderTextColor="#666"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contrasena"
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmPass}
          onChangeText={setConfirmPass}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electronico"
          placeholderTextColor="#666"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefono"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={telefono}
          onChangeText={setTelefono}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿Ya tienes una cuenta? Inicia sesión
        </Text>
      </View>

      <View style={styles.bottomWave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0D1B2A", 
    alignItems: "center",
    paddingTop: 40,
  },

  topWave: {
    width: "100%",
    height: 180,
    backgroundColor: "#0D1B2A",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },

  formWrapper: {
    width: "85%",
    backgroundColor: "#0D1B2A",
    marginTop: -60,
    padding: 30,
    borderRadius: 20,
  },

  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#E5E5E5",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#122b44ff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#ccc",
  },

  bottomWave: {
    width: "100%",
    height: 200,
    backgroundColor: "#0D1B2A",
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    marginTop: 30,
  },
});