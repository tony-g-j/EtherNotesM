import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { NoteController } from "../controllers/NoteController"

const noteController = new NoteController()

export default function NoteDetail({ navigation, route }) {
  const { noteId } = route.params
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true)
        const noteData = await noteController.getNoteById(noteId)
        setNote(noteData)
      } catch (error) {
        console.error("Error loading note:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNote()
  }, [noteId])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
      </SafeAreaView>
    )
  }

  if (!note) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>ETERNOTES</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.errorText}>Note not found</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>ETERNOTES</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.layout}>
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
            <Ionicons name="folder-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="book-outline" size={24} color="#8b5cf6" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={24} color="white" />
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity>
            <Ionicons name="stats-chart-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Configuracion")}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentArea}>
          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.noteContent}>{note.content}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1f3a",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#0f1419",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2f4a",
  },
  appTitle: {
    color: "#8b5cf6",
    fontSize: 16,
    fontWeight: "bold",
  },
  layout: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 60,
    backgroundColor: "#0f1419",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
    borderRightWidth: 1,
    borderRightColor: "#2a2f4a",
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  noteTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 16,
  },
  noteContent: {
    color: "#c9d1e0",
    fontSize: 14,
    lineHeight: 22,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
})
