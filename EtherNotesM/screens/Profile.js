import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Svg, { Path } from "react-native-svg"
import UsuarioController from "../controllers/UsuarioController"

const { width } = Dimensions.get("window")
const controller = new UsuarioController()

export default function Profile({ navigation, currentUserID }) {
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({ totalVaults: 0, totalNotes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!currentUserID) {
          console.log("No currentUserID found")
          setLoading(false)
          return
        }

        const user = await controller.getUserById(currentUserID)
        console.log("Loading Profile data for user:", currentUserID)

        setUserData({
          nombre: user?.nombre,
          correo: user?.correo,
          descripcion: "Usuario de ETERNOTES",
        })

        const userStats = await controller.getUserStats(currentUserID)
        console.log("User stats loaded:", userStats)

        setStats(userStats || { totalVaults: 0, totalNotes: 0 })
        setLoading(false)
      } catch (error) {
        console.error("Error loading profile data:", error)
        setLoading(false)
      }
    }

    loadUserData()
  }, [currentUserID])

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.svgContainerTop}>
        <Svg width={412} height={200} fill="none">
          <Path fill="#191A2C" d="M0 0h412v150.242s-53.5 111.955-206 0c-152.5-111.954-206 0-206 0V0Z" />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={130} color="white" />
        </View>

        <Text style={styles.nameText}>{userData?.nombre}</Text>
        <Text style={styles.emailText}>{userData?.correo}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Descripción</Text>
          <Text style={styles.infoText}>{userData?.descripcion || "Sin descripción"}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="cube-outline" size={30} color="#191A2C" />
            <Text style={styles.statNumber}>{stats.totalVaults}</Text>
            <Text style={styles.statLabel}>Baúles</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="document-text-outline" size={30} color="#191A2C" />
            <Text style={styles.statNumber}>{stats.totalNotes}</Text>
            <Text style={styles.statLabel}>Notas</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.svgContainerBottom}>
        <Svg width={412} height={199} fill="none">
          <Path fill="#191A2C" d="M0 48.122s53 108.274 206 0 206 0 206 0V200H0V48.122Z" />
        </Svg>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1B2D45",
  },
  svgContainerTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  svgContainerBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 160,
    zIndex: 10,
  },
  avatarContainer: {
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  nameText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: "white",
    width: width * 0.85,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  label: {
    fontSize: 14,
    color: "#191A2C",
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
    gap: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#191A2C",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 50,
  },
})
