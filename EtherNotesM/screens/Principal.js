import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Principal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [fecha, setFecha] = useState("");

  const [notas, setNotas] = useState([]);

  const [editando, setEditando] = useState(null); // null = modo crear


  const guardarNota = () => {
    if (editando !== null) {
      const nuevasNotas = [...notas];
      nuevasNotas[editando] = { titulo, subtitulo, fecha, contenido };
      setNotas(nuevasNotas);
      setEditando(null);
    } else {
      setNotas([
        ...notas,
        { titulo, subtitulo, fecha, contenido }
      ]);
    }

    // Cerrar modal y limpiar
    setTitulo("");
    setSubtitulo("");
    setFecha("");
    setContenido("");
    setModalVisible(false);
  };



  const editarNota = (index) => {
    const n = notas[index];
    setTitulo(n.titulo);
    setSubtitulo(n.subtitulo);
    setFecha(n.fecha);
    setContenido(n.contenido);
    setEditando(index);
    setModalVisible(true);
  };


  const eliminarNota = (index) => {
    const filtradas = notas.filter((_, i) => i !== index);
    setNotas(filtradas);
  };


  return (
    <SafeAreaView style={styles.container}>


      <View style={styles.topBar}>
        <Ionicons name="search" size={54} color="white"  />

        <TextInput
          placeholder="ETERNOTES"
          placeholderTextColor="#7a7ca1ff"
          style={styles.searchInput}
        />

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={54} color="white" />
        </TouchableOpacity>
      </View>


      {/* Layout general */}
      <View style={styles.layout}>

        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Ionicons name="folder-outline" size={54} color="white" />
          <Ionicons name="document-text-outline" size={54} color="white" />
          <Ionicons name="person-circle-outline" size={54} color="white" />
          <Ionicons
            name="settings-outline"
            size={54}
            color="white"
            style={{ marginTop: "auto", marginBottom: 20 }}
          />
        </View>


        {/* Contenido principal */}
        <ScrollView style={styles.mainContent}>
          <Text style={styles.title}>Tus notas</Text>

          {notas.map((n, index) => (
            <View key={index} style={styles.noteBox}>
              <Text style={styles.noteTitle}>{n.titulo}</Text>
              <Text style={styles.noteSubtitle}>{n.subtitulo}</Text>
              <Text style={styles.noteDate}>{n.fecha}</Text>

              <Text style={styles.noteContent}>{n.contenido}</Text>

              {/* Botones de acción */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => editarNota(index)}
                >
                  <Ionicons name="create-outline" size={30} color="yellow" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => eliminarNota(index)}
                >
                  <Ionicons name="trash-outline" size={30} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

      </View>


      {/* MODAL CRUD */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              {editando !== null ? "Editar nota" : "Nueva nota"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#bfbfd9"
              value={titulo}
              onChangeText={setTitulo}
            />

            <TextInput
              style={styles.input}
              placeholder="Subtítulo"
              placeholderTextColor="#bfbfd9"
              value={subtitulo}
              onChangeText={setSubtitulo}
            />

            <TextInput
              style={styles.input}
              placeholder="Fecha (dd/mm/aaaa)"
              placeholderTextColor="#bfbfd9"
              value={fecha}
              onChangeText={setFecha}
            />

            {/* CONTENIDO LARGO */}
            <TextInput
              style={[styles.input, { height: 120, textAlignVertical: "top" }]}
              placeholder="Contenido de la nota..."
              placeholderTextColor="#bfbfd9"
              value={contenido}
              multiline={true}
              onChangeText={setContenido}
            />

            {/* Botones */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#d9534f" }]}
                onPress={() => {
                  setModalVisible(false);
                  setEditando(null);
                }}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#5cb85c" }]}
                onPress={guardarNota}
              >
                <Text style={styles.btnText}>
                  {editando !== null ? "Guardar cambios" : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#191a2C",
    elevation: 5,
    gap: 15,
  },
  searchInput: {
    color: "white",
    flex: 1,
    backgroundColor: "#222556",
    padding: 19,
    borderRadius: 8,
    fontSize: 28,
  },

  layout: {
    flex: 1,
    flexDirection: "row",
  },

  sidebar: {
    width: 80,
    backgroundColor: "#191a2C",
    alignItems: "center",
    paddingVertical: 20,
    gap: 60,
    borderRightWidth: 2,
    borderRightColor: "#222556",
  },

  mainContent: {
    flex: 1,
    padding: 25,
    backgroundColor: "#1b2d45",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },

  noteBox: {
    backgroundColor: "#22375a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  noteSubtitle: {
    fontSize: 20,
    color: "#d1d1d1",
  },
  noteDate: {
    fontSize: 16,
    color: "#b7b7b7",
    marginBottom: 10,
  },
  noteContent: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  editBtn: {},
  deleteBtn: {},

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#191a2C",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "white",
  },
  input: {
    fontSize: 18,
    backgroundColor: "#222556",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    color: "white",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    width: "48%",
  },
  btnText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
