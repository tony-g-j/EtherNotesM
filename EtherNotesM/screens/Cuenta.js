import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import Svg, { Path } from "react-native-svg"
import UsuarioController from "../controllers/UsuarioController"

const { width, height } = Dimensions.get("window")
const controller = new UsuarioController()

export default function Cuenta({ navigation, currentUserID, onLogout }) {
  const [user, setUser] = useState(null)
  const [modalEmailVisible, setModalEmailVisible] = useState(false)
  const [modalPassVisible, setModalPassVisible] = useState(false)
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [actionType, setActionType] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        const userData = await controller.getUserById(currentUserID)
        if (userData) {
          setUser(userData)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error loading user data:", error)
        setLoading(false)
      }
    }

    if (currentUserID) {
      loadUserData()
    }
  }, [currentUserID])

  const openConfirmation = (action) => {
    setActionType(action)
    setModalConfirmVisible(true)
  }

  const handleEmailUpdate = async () => {
    if (!newEmail) {
      Alert.alert("Error", "Por favor ingresa un nuevo correo")
      return
    }

    setLoading(true)
    const result = await controller.updateUserEmail(user.id, newEmail)
    setLoading(false)

    if (result.success) {
      setUser({ ...user, correo: newEmail })
      setNewEmail("")
      setModalEmailVisible(false)
      Alert.alert("Éxito", "Correo actualizado exitosamente")
    } else {
      Alert.alert("Error", result.message)
    }
  }

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    const result = await controller.updateUserPassword(user.id, newPassword)
    setLoading(false)

    if (result.success) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setModalPassVisible(false)
      Alert.alert("Éxito", "Contraseña actualizada exitosamente")
    } else {
      Alert.alert("Error", result.message)
    }
  }

  const handleConfirmAction = async () => {
    setModalConfirmVisible(false)
    setLoading(true)

    let result = { success: false }

    switch (actionType) {
      case "Borrar Historial":
        result = await controller.deleteAllNotes(user.id)
        break
      case "Borrar Notas":
        result = await controller.deleteAllNotes(user.id)
        break
      case "Desactivar Cuenta":
        result = await controller.deactivateAccount(user.id)
        break
      case "Eliminar Cuenta":
        result = await controller.deleteUser(user.id)
        if (result.success) {
          onLogout()
          return
        }
        break
    }

    setLoading(false)

    if (result.success) {
      Alert.alert("Éxito", result.message || `Acción realizada: ${actionType}`)
    } else {
      Alert.alert("Error", result.message || "Error al realizar la acción")
    }
  }

  if (!user) {
    return (
      <View style={styles.MainContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  return (
    <View style={styles.MainContainer}>
      <View style={styles.Superior}>
        <Svg width={412} height={150} fill="none">
          <Path
            fill="#191A2C"
            d={`M 0 0 L 412 0 L 412 120 Q 412 150 380 150 C 300 150 360 52 206 52 C 52 52 112 150 32 150 Q -12.5 150 0 120 Z`}
          />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image style={styles.profileImg} source={require("../assets/favicon.png")} resizeMode="cover" />

        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.textN}>
              <Text style={styles.textB}>Nombre: </Text>
              {user?.nombre || "Usuario"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.subContainer}
            onPress={() => {
              setNewEmail(user?.correo || "")
              setModalEmailVisible(true)
            }}
          >
            <Text style={styles.textN}>
              <Text style={styles.textB}>Correo: </Text>
              {user?.email || "No disponible"}
            </Text>
            <Text style={{ fontSize: 10, color: "#555", marginTop: 2 }}>(Toca para editar)</Text>
          </TouchableOpacity>

          <View style={styles.subContainer}>
            <Text style={[styles.textB, { textAlign: "center" }]}>Contraseña:</Text>
            <TouchableOpacity style={styles.btn1} onPress={() => setModalPassVisible(true)}>
              <Text style={[styles.textB, { color: "#FFF" }]}>Cambiar Contraseña</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subContainer}>
            <Text style={[styles.textB, { textAlign: "center" }]}>Ajustes de la cuenta</Text>

            <TouchableOpacity style={styles.btn1} onPress={() => openConfirmation("Borrar Historial")}>
              <Text style={[styles.textB, { color: "#FFF" }]}>Borrar Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn1} onPress={() => openConfirmation("Borrar Notas")}>
              <Text style={[styles.textB, { color: "#FFF" }]}>Borrar Notas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn1} onPress={() => openConfirmation("Desactivar Cuenta")}>
              <Text style={[styles.textB, { color: "#FFF" }]}>Desactivar Cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn1} onPress={() => openConfirmation("Eliminar Cuenta")}>
              <Text style={[styles.textB, { color: "#FFF" }]}>Eliminar Cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Svg width={412} height={150} fill="none">
          <Path fill="#191A2C" d="M0 48.122s53 108.274 206 0 206 0 206 0V200H0V48.122Z" />
        </Svg>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEmailVisible}
        onRequestClose={() => setModalEmailVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Actualizar Correo</Text>
            <TextInput
              style={styles.input}
              placeholder="Nuevo correo electrónico"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              editable={!loading}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnCancel]}
                onPress={() => setModalEmailVisible(false)}
                disabled={loading}
              >
                <Text style={styles.textWhite}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnSave]}
                onPress={handleEmailUpdate}
                disabled={loading}
              >
                <Text style={styles.textWhite}>{loading ? "Guardando..." : "Guardar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPassVisible}
        onRequestClose={() => setModalPassVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar nueva contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnCancel]}
                onPress={() => setModalPassVisible(false)}
                disabled={loading}
              >
                <Text style={styles.textWhite}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnSave]}
                onPress={handlePasswordUpdate}
                disabled={loading}
              >
                <Text style={styles.textWhite}>{loading ? "Actualizando..." : "Actualizar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalConfirmVisible}
        onRequestClose={() => setModalConfirmVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { borderColor: "#8B0000", borderWidth: 2 }]}>
            <Text style={styles.modalTitle}>¿Estás seguro?</Text>
            <Text style={{ marginBottom: 20, textAlign: "center" }}>
              Estás a punto de: <Text style={{ fontWeight: "bold" }}>{actionType}</Text>.{"\n"}Esta acción podría ser
              irreversible.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnCancel]}
                onPress={() => setModalConfirmVisible(false)}
                disabled={loading}
              >
                <Text style={styles.textWhite}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnConfirm]}
                onPress={handleConfirmAction}
                disabled={loading}
              >
                <Text style={styles.textWhite}>{loading ? "Procesando..." : "Confirmar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#1B2D45",
    alignItems: "center",
    justifyContent: "center",
  },
  Superior: {
    position: "absolute",
    top: 0,
    zIndex: 0,
    left: 0,
  },
  profileImg: {
    height: 150,
    width: 150,
    top: "6.8%",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#BCBAC7",
  },
  content: {
    flexGrow: 1,
    gap: 120,
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  container: {
    flex: 1,
    maxHeight: 450,
    width: width * 0.9,
    gap: 11,
    alignItems: "center",
  },
  subContainer: {
    width: width * 0.65,
    justifyContent: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    padding: 12,
  },
  textB: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textN: {
    fontWeight: "normal",
    fontSize: 16,
  },
  btn1: {
    backgroundColor: "#191A2C",
    borderRadius: 16,
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  btnModal: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#777",
  },
  btnSave: {
    backgroundColor: "#191A2C",
  },
  btnConfirm: {
    backgroundColor: "#8B0000",
  },
  textWhite: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})
