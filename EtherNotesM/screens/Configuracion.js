import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import UsuarioController from "../controllers/UsuarioController"

const { height } = Dimensions.get("window")
const controller = new UsuarioController()

export default function ConfigScreen({ navigation, currentUserID, onLogout }) {
  const [modalHelpVisible, setModalHelpVisible] = useState(false)
  const [modalPrivacyVisible, setModalPrivacyVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        onPress: () => onLogout(),
        style: "destructive",
      },
    ])
  }

  const handleThemeChange = () => {
    Alert.alert("Tema", "Funcionalidad de tema disponible próximamente")
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="person-outline" size={90} color="white" />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cuenta")} disabled={loading}>
        <Text style={styles.buttonText}>Editar Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleThemeChange} disabled={loading}>
        <Text style={styles.buttonText}>Cambiar tema</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setModalHelpVisible(true)} disabled={loading}>
        <Text style={styles.buttonText}>Ayuda</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setModalPrivacyVisible(true)} disabled={loading}>
        <Text style={styles.buttonText}>Política de privacidad</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout} disabled={loading}>
        <Ionicons name="log-out-outline" size={30} color="white" />
        <Text style={styles.logoutText}>{loading ? "Cerrando..." : "Cerrar Sesión"}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalHelpVisible}
        onRequestClose={() => setModalHelpVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Guía de Usuario</Text>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.modalText}>
                <Text style={{ fontWeight: "bold" }}>Bienvenido a ETERNOTES</Text>
                {"\n\n"}
                ETERNOTES es tu plataforma segura para guardar y gestionar notas importantes con total privacidad.
                {"\n\n"}
                <Text style={{ fontWeight: "bold" }}>Características principales:</Text>
                {"\n"}• Crear y organizar notas en baúles
                {"\n"}• Editar y actualizar contenido en tiempo real
                {"\n"}• Gestionar tu perfil y configuración de cuenta
                {"\n"}• Almacenamiento seguro local-first
                {"\n\n"}
                <Text style={{ fontWeight: "bold" }}>Tips útiles:</Text>
                {"\n"}• Toca en tus notas para editar rápidamente
                {"\n"}• Organiza tus baúles por tema o proyecto
                {"\n"}• Usa el perfil para ver tus estadísticas
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalHelpVisible(false)}>
              <Text style={styles.closeButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPrivacyVisible}
        onRequestClose={() => setModalPrivacyVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Política de Privacidad</Text>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.modalText}>
                <Text style={{ fontWeight: "bold" }}>Tus datos son tuyos.</Text>
                {"\n\n"}
                Al igual que aplicaciones como Obsidian, creemos en la privacidad absoluta. Esta aplicación funciona
                bajo un modelo "Local-First".
                {"\n\n"}
                <Text style={{ fontWeight: "bold" }}>1. Almacenamiento Local:</Text>
                {"\n"}Todas tus notas, configuraciones y carpetas se almacenan localmente en tu dispositivo. Nosotros no
                tenemos acceso a tus archivos ni los almacenamos en servidores externos.
                {"\n\n"}
                <Text style={{ fontWeight: "bold" }}>2. Sin Rastreo:</Text>
                {"\n"}No utilizamos cookies de seguimiento, ni recopilamos datos de comportamiento, ni vendemos tu
                información a terceros.
                {"\n\n"}
                <Text style={{ fontWeight: "bold" }}>3. Seguridad:</Text>
                {"\n"}Dado que los datos viven en tu dispositivo, la seguridad de tus notas depende de la seguridad de
                tu teléfono. Recomendamos mantener tu dispositivo actualizado y con contraseña.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalPrivacyVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
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
    fontWeight: "600",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    width: "85%",
    maxHeight: height * 0.7,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0d1b2a",
  },
  scrollView: {
    width: "100%",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "justify",
  },
  closeButton: {
    backgroundColor: "#1a1a42ff",
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: 100,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
})
