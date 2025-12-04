import { useState, useEffect } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { VaultController } from "../controllers/VaultController"
import { NoteController } from "../controllers/NoteController"

const vaultController = new VaultController()
const noteController = new NoteController()

export default function Principal({ navigation, currentUserID }) {
  const [vaults, setVaults] = useState([])
  const [selectedVault, setSelectedVault] = useState(null)
  const [vaultDropdownOpen, setVaultDropdownOpen] = useState(false)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")

  const [noteModalVisible, setNoteModalVisible] = useState(false)
  const [vaultModalVisible, setVaultModalVisible] = useState(false)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [vaultName, setVaultName] = useState("")
  const [vaultDescription, setVaultDescription] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const userVaults = await vaultController.getVaultsByUser(currentUserID)
        setVaults(userVaults)
        if (userVaults.length > 0) {
          setSelectedVault(userVaults[0])
          const vaultNotes = await noteController.getNotesByVault(userVaults[0].id)
          setNotes(vaultNotes)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentUserID])

  useEffect(() => {
    const loadNotesForVault = async () => {
      if (selectedVault) {
        try {
          const vaultNotes = await noteController.getNotesByVault(selectedVault.id)
          setNotes(vaultNotes)
        } catch (error) {
          console.error("Error loading notes:", error)
        }
      }
    }

    loadNotesForVault()
  }, [selectedVault])

  const handleCreateNote = async () => {
    if (!noteTitle.trim() || !selectedVault) {
      console.log("[v0] Validation failed - Title: ", noteTitle, "Vault: ", selectedVault)
      return
    }

    try {
      console.log("[v0] Creating note with title:", noteTitle)
      await noteController.createNote(noteTitle, noteContent, selectedVault.id)
      const updatedNotes = await noteController.getNotesByVault(selectedVault.id)
      setNotes(updatedNotes)
      setNoteTitle("")
      setNoteContent("")
      setNoteModalVisible(false)
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  const handleUpdateNote = async () => {
    if (!noteTitle.trim() || !editingNoteId) return

    try {
      await noteController.updateNote(editingNoteId, { title: noteTitle, content: noteContent })
      const updatedNotes = await noteController.getNotesByVault(selectedVault.id)
      setNotes(updatedNotes)
      setNoteTitle("")
      setNoteContent("")
      setEditingNoteId(null)
      setNoteModalVisible(false)
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const handleDeleteNote = async (noteId) => {
    try {
      await noteController.deleteNote(noteId)
      const updatedNotes = await noteController.getNotesByVault(selectedVault.id)
      setNotes(updatedNotes)
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const openEditNoteModal = (note) => {
    setNoteTitle(note.title)
    setNoteContent(note.content)
    setEditingNoteId(note.id)
    setNoteModalVisible(true)
  }

  const handleViewNote = (note) => {
    navigation.navigate("NoteDetail", { noteId: note.id })
  }

  const handleCreateVault = async () => {
    if (!vaultName.trim()) return

    try {
      await vaultController.createVault(vaultName, "personal", currentUserID, vaultDescription)
      const updatedVaults = await vaultController.getVaultsByUser(currentUserID)
      setVaults(updatedVaults)
      setVaultName("")
      setVaultDescription("")
      setVaultModalVisible(false)
    } catch (error) {
      console.error("Error creating vault:", error)
    }
  }

  const handleDeleteVault = async (vaultId) => {
    try {
      await vaultController.deleteVault(vaultId)
      const updatedVaults = await vaultController.getVaultsByUser(currentUserID)
      setVaults(updatedVaults)
      if (selectedVault?.id === vaultId) {
        setSelectedVault(updatedVaults[0] || null)
      }
    } catch (error) {
      console.error("Error deleting vault:", error)
    }
  }

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchText.toLowerCase()))

  const openCreateNoteModal = () => {
    setNoteTitle("")
    setNoteContent("")
    setEditingNoteId(null)
    setNoteModalVisible(true)
  }

  const isNoteFormValid = noteTitle.trim().length > 0 && selectedVault !== null

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Ionicons name="search" size={20} color="#6B7A9E" />
        <Text style={styles.appTitle}>ETERNOTES</Text>
        <TouchableOpacity onPress={openCreateNoteModal}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.layout}>
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setVaultModalVisible(true)}>
            <Ionicons name="folder-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (filteredNotes.length > 0) {
                handleViewNote(filteredNotes[0])
              }
            }}
          >
            <Ionicons name="book-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Profile", { currentUserID })}>
            <Ionicons name="person-circle-outline" size={24} color="white" />
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
            <Ionicons name="stats-chart-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Configuracion", { currentUserID })}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.mainContent}>
          <View style={styles.vaultContainer}>
            <Text style={styles.vaultLabel}>Vaults</Text>
            <TouchableOpacity style={styles.vaultDropdown} onPress={() => setVaultDropdownOpen(!vaultDropdownOpen)}>
              <Text style={styles.vaultDropdownText}>{selectedVault?.name || "Select Vault"}</Text>
              <Ionicons name={vaultDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="white" />
            </TouchableOpacity>

            {vaultDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {vaults.map((vault) => (
                  <View key={vault.id} style={styles.dropdownItemContainer}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedVault(vault)
                        setVaultDropdownOpen(false)
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{vault.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteVault(vault.id)} style={styles.deleteVaultBtn}>
                      <Ionicons name="trash-outline" size={16} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor="#6B7A9E"
            value={searchText}
            onChangeText={setSearchText}
          />

          {loading ? (
            <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.notesList}>
              {filteredNotes.length === 0 ? (
                <Text style={{ color: "white", fontSize: 16, textAlign: "center", marginTop: 20 }}>
                  No notes yet. Create one to get started!
                </Text>
              ) : (
                filteredNotes.map((note) => (
                  <View key={note.id} style={styles.noteItem}>
                    <TouchableOpacity style={styles.noteContent} onPress={() => handleViewNote(note)}>
                      <Text style={styles.noteTitle}>{note.title}</Text>
                      <Text style={styles.notePreview} numberOfLines={2}>
                        {note.content}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteNote(note.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <Modal
        visible={noteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setNoteModalVisible(false)
          setNoteTitle("")
          setNoteContent("")
          setEditingNoteId(null)
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingNoteId ? "Edit Note" : "New Note"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Title (required)"
              placeholderTextColor="#6B7A9E"
              value={noteTitle}
              onChangeText={setNoteTitle}
            />

            <TextInput
              style={[styles.input, { height: 120 }]}
              placeholder="Content"
              placeholderTextColor="#6B7A9E"
              value={noteContent}
              onChangeText={setNoteContent}
              multiline
            />

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: isNoteFormValid ? "#4CAF50" : "#888888",
                  },
                ]}
                onPress={editingNoteId ? handleUpdateNote : handleCreateNote}
                disabled={!isNoteFormValid}
              >
                <Text style={styles.btnText}>{editingNoteId ? "Update" : "Create"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#f44336" }]}
                onPress={() => {
                  setNoteModalVisible(false)
                  setNoteTitle("")
                  setNoteContent("")
                  setEditingNoteId(null)
                }}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={vaultModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setVaultModalVisible(false)
          setVaultName("")
          setVaultDescription("")
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Vault</Text>

            <TextInput
              style={styles.input}
              placeholder="Vault Name"
              placeholderTextColor="#6B7A9E"
              value={vaultName}
              onChangeText={setVaultName}
            />

            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description (optional)"
              placeholderTextColor="#6B7A9E"
              value={vaultDescription}
              onChangeText={setVaultDescription}
              multiline
            />

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: "#4CAF50" }]} onPress={handleCreateVault}>
                <Text style={styles.btnText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#f44336" }]}
                onPress={() => {
                  setVaultModalVisible(false)
                  setVaultName("")
                  setVaultDescription("")
                }}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  mainContent: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  vaultContainer: {
    marginBottom: 15,
  },
  vaultLabel: {
    color: "#8b5cf6",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  vaultDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2f4a",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3a3f5a",
  },
  vaultDropdownText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownMenu: {
    backgroundColor: "#2a2f4a",
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#3a3f5a",
    maxHeight: 200,
  },
  dropdownItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#3a3f5a",
  },
  dropdownItem: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemText: {
    color: "white",
    fontSize: 13,
  },
  deleteVaultBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: "#2a2f4a",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#3a3f5a",
    fontSize: 13,
  },
  notesList: {
    gap: 10,
  },
  noteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2f4a",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3a3f5a",
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  notePreview: {
    color: "#8b9bb4",
    fontSize: 12,
  },
  deleteBtn: {
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1f3a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#2a2f4a",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3a3f5a",
    fontSize: 13,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
})
