import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ConfigScreen() {
  const [conteo, setConteo] = useState(false); 

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="person-outline" size={90} color="white" />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cambiar tema</Text>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Mostrar conteo de palabras</Text>
        <Switch value={conteo} onValueChange={setConteo} />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ayuda</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Política de privacidad</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutContainer}>
        <Ionicons name="log-out-outline" size={30} color="white" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2a",
    alignItems: "center",
    paddingTop: 80,
  },

  iconContainer: {
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#d9d9d9",
    width: "80%",
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 16,
  },

  switchContainer: {
    backgroundColor: "#d9d9d9",
    width: "80%",
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchLabel: {
    fontSize: 15,
  },

  backButton: {
    backgroundColor: "#1a1a42ff",
    padding: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginTop: 20,
  },

  backText: {
    color: "white",
    fontSize: 16,
  },

  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },

  logoutText: {
    color: "white",
    marginLeft: 8,
    fontSize: 18,
  },
});