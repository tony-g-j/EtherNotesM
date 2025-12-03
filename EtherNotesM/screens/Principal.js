import React, { useState, useMemo } from "react";
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
  const [modalCarpetaVisible, setModalCarpetaVisible] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [fecha, setFecha] = useState("");

  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState("Personal");
  const [carpetaVista, setCarpetaVista] = useState(null);

  const [notas, setNotas] = useState([]);
  const [editando, setEditando] = useState(null);

  const [seccion, setSeccion] = useState("notas");

  // Carpetas iniciales: Solo "Personal" y "Escuela"
  const [carpetasDisponibles, setCarpetasDisponibles] = useState([
    "Personal",
    "Escuela",
  ]);

  const [nuevaCarpetaNombre, setNuevaCarpetaNombre] = useState("");

  // Estado para el buscador
  const [searchText, setSearchText] = useState("");

  const abrirModalNuevaNota = () => {
    setTitulo("");
    setSubtitulo("");
    setContenido("");
    setFecha("");
    setCarpetaSeleccionada("Personal");
    setEditando(null);
    setModalVisible(true);
  };

  const guardarNota = () => {
    if (editando !== null) {
      const nuevas = [...notas];
      nuevas[editando] = {
        titulo,
        subtitulo,
        fecha,
        contenido,
        carpeta: carpetaSeleccionada,
      };
      setNotas(nuevas);
      setEditando(null);
    } else {
      setNotas([
        ...notas,
        {
          titulo,
          subtitulo,
          fecha,
          contenido,
          carpeta: carpetaSeleccionada,
        },
      ]);
    }

    setModalVisible(false);
  };

  const editarNota = (i) => {
    const n = notas[i];
    setTitulo(n.titulo);
    setSubtitulo(n.subtitulo);
    setFecha(n.fecha);
    setContenido(n.contenido);
    setCarpetaSeleccionada(n.carpeta);
    setEditando(i);
    setModalVisible(true);
  };

  const eliminarNota = (i) => {
    setNotas(notas.filter((_, idx) => idx !== i));
  };

  const agregarCarpeta = () => {
    if (nuevaCarpetaNombre.trim() === "") return;
    if (carpetasDisponibles.includes(nuevaCarpetaNombre.trim())) return;

    setCarpetasDisponibles([...carpetasDisponibles, nuevaCarpetaNombre.trim()]);
    setNuevaCarpetaNombre("");
    setModalCarpetaVisible(false);
  };

  // LÓGICA DE FILTRADO PARA LA SECCIÓN "NOTAS" GENERALES
  const notasFiltradasGeneral = useMemo(() => {
    if (seccion !== "notas" || searchText.trim() === "") {
      return notas;
    }
    const lowerSearchText = searchText.toLowerCase();
    // Filtro general, solo por Título
    return notas.filter((n) => n.titulo.toLowerCase().includes(lowerSearchText));
  }, [notas, seccion, searchText]);

  // LÓGICA DE FILTRADO PARA CARPETAS (SECCIÓN "FOLDERS")
  const carpetasFiltradas = useMemo(() => {
    if (seccion !== "folders" || searchText.trim() === "") {
      return carpetasDisponibles;
    }
    const lowerSearchText = searchText.toLowerCase();
    // Filtro de carpetas, solo por Nombre de Carpeta
    return carpetasDisponibles.filter((c) =>
      c.toLowerCase().includes(lowerSearchText)
    );
  }, [carpetasDisponibles, seccion, searchText]);

  // -----------------------------------------------------

  const renderContenido = () => {
    if (seccion === "folder" && carpetaVista !== null) {
      // 1. Filtrar por la carpeta actual
      let filtradasPorCarpeta = notas.filter((n) => n.carpeta === carpetaVista);

      // 2. Aplicar el filtro de búsqueda por TÍTULO (Solo si hay texto de búsqueda)
      let filtradasFinal = filtradasPorCarpeta;
      if (searchText.trim() !== "") {
        const lowerSearchText = searchText.toLowerCase();
        filtradasFinal = filtradasPorCarpeta.filter((n) =>
          n.titulo.toLowerCase().includes(lowerSearchText)
        );
      }
      
      return (
        <>
          <Text style={styles.title}>Carpeta: {carpetaVista}</Text>

          {filtradasFinal.length === 0 && (
            <Text style={{ color: "white", fontSize: 20 }}>
              {searchText.trim() !== ""
                ? `No se encontraron notas con el título "${searchText}" en esta carpeta.`
                : "Sin notas aquí."}
            </Text>
          )}

          {filtradasFinal.map((n, index) => {
             // Encuentra el índice original para edición/eliminación
             const originalIndex = notas.findIndex(
              (nota) => nota.titulo === n.titulo && nota.contenido === n.contenido && nota.carpeta === n.carpeta
            );

            return (
              <View key={originalIndex} style={styles.noteBox}>
                <Text style={styles.noteTitle}>{n.titulo}</Text>
                <Text style={styles.noteSubtitle}>{n.subtitulo}</Text>
                <Text style={styles.noteDate}>{n.fecha}</Text>
                <Text style={styles.noteContent}>{n.contenido}</Text>

                <View style={styles.actionsRow}>
                  {/* Edición/Eliminación usando el índice original encontrado */}
                  <TouchableOpacity onPress={() => editarNota(originalIndex)}>
                    <Ionicons name="create-outline" size={30} color="yellow" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarNota(originalIndex)}>
                    <Ionicons name="trash-outline" size={30} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </>
      );
    }

    if (seccion === "folders") {
      return (
        <>
          <Text style={styles.title}>Carpetas</Text>

          {carpetasFiltradas.length === 0 && (
            <Text style={{ color: "white", fontSize: 20 }}>
              {searchText.trim() !== ""
                ? `No se encontraron carpetas con el título "${searchText}".`
                : "Aún no tienes carpetas."}
            </Text>
          )}

          {/* 🔥 USO DEL NUEVO ESTADO FILTRADO: carpetasFiltradas */}
          {carpetasFiltradas.map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.noteBox}
              onPress={() => {
                setCarpetaVista(c);
                setSeccion("folder");
                setSearchText(""); // Limpiar búsqueda al entrar en la vista de carpeta
              }}
            >
              <Text style={styles.noteTitle}>{c}</Text>
            </TouchableOpacity>
          ))}
        </>
      );
    }

    // Sección principal de notas
    return (
      <>
        <Text style={styles.title}>Tus notas</Text>

        {notasFiltradasGeneral.length === 0 && (
          <Text style={{ color: "white", fontSize: 20 }}>
            {searchText.trim() !== ""
              ? "No se encontraron notas con ese título."
              : "Aún no tienes notas."}
          </Text>
        )}

        {notasFiltradasGeneral.map((n) => {
          // Encuentra el índice original para edición/eliminación
          const originalIndex = notas.findIndex(
            (nota) => nota.titulo === n.titulo && nota.contenido === n.contenido
          );

          return (
            <View key={originalIndex} style={styles.noteBox}>
              <Text style={styles.noteTitle}>{n.titulo}</Text>
              <Text style={styles.noteSubtitle}>{n.subtitulo}</Text>
              <Text style={styles.noteDate}>{n.fecha}</Text>

              <Text style={styles.folderTag}>Carpeta: {n.carpeta}</Text>

              <Text style={styles.noteContent}>{n.contenido}</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={() => editarNota(originalIndex)}>
                  <Ionicons name="create-outline" size={30} color="yellow" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => eliminarNota(originalIndex)}>
                  <Ionicons name="trash-outline" size={30} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  // -----------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Ionicons name="search" size={54} color="white" />

        <TextInput
          placeholder={
            seccion === "folders"
              ? "Buscar carpetas..."
              : "Buscar por Título..."
          }
          placeholderTextColor="#7a7ca1ff"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          // 🔥 CORRECCIÓN: Editable en notas, carpeta o folders
          editable={
            seccion === "notas" || seccion === "folder" || seccion === "folders"
          }
        />

        {/* 🔵 BOTÓN DE AGREGAR */}
        <TouchableOpacity
          onPress={() => {
            if (seccion === "folders") setModalCarpetaVisible(true);
            else abrirModalNuevaNota();
          }}
        >
          <Ionicons name="add-circle-outline" size={54} color="white" />
        </TouchableOpacity>
      </View>

      {/* LAYOUT */}
      <View style={styles.layout}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <TouchableOpacity 
            onPress={() => {
              setSeccion("notas");
              setSearchText(""); 
            }}
          >
            <Ionicons name="document-text-outline" size={54} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setSeccion("folders");
              setSearchText(""); // Limpiar búsqueda al ir a la sección de carpetas
            }}
          >
            <Ionicons name="folder-outline" size={54} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSeccion("perfil")}>
            <Ionicons name="person-circle-outline" size={54} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSeccion("config")}
            style={{ marginTop: "auto", marginBottom: 20 }}
          >
            <Ionicons name="settings-outline" size={54} color="white" />
          </TouchableOpacity>
        </View>

        {/* CONTENIDO */}
        <ScrollView style={styles.mainContent}>
          {renderContenido()}
        </ScrollView>
      </View>

      {/* MODAL DE NOTA */}
      <Modal animationType="slide" transparent visible={modalVisible}>
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

            <TextInput
              style={[styles.input, { height: 100 }]} 
              placeholder="Contenido de la nota"
              placeholderTextColor="#bfbfd9"
              multiline
              value={contenido}
              onChangeText={setContenido}
            />

            <Text style={styles.folderLabel}>Carpeta:</Text>

            <ScrollView style={{ maxHeight: 150, marginBottom: 10 }}>
              {carpetasDisponibles.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.folderOption,
                    carpetaSeleccionada === c && styles.folderOptionSelected,
                  ]}
                  onPress={() => setCarpetaSeleccionada(c)}
                >
                  <Text style={styles.folderOptionText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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

      {/* MODAL NUEVO — AGREGAR CARPETA */}
      <Modal animationType="slide" transparent visible={modalCarpetaVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva carpeta</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de la carpeta"
              placeholderTextColor="#bfbfd9"
              value={nuevaCarpetaNombre}
              onChangeText={setNuevaCarpetaNombre}
            />

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#d9534f" }]}
                onPress={() => setModalCarpetaVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#5cb85c" }]}
                onPress={agregarCarpeta}
              >
                <Text style={styles.btnText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// (ESTILOS IGUALES)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#191a2C",
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
  layout: { flex: 1, flexDirection: "row" },
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
  noteTitle: { fontSize: 26, fontWeight: "bold", color: "white" },
  noteSubtitle: { fontSize: 20, color: "#d1d1d1" },
  noteDate: { fontSize: 16, color: "#b7b7b7", marginBottom: 10 },
  noteContent: { fontSize: 18, color: "white", marginBottom: 10 },
  folderTag: {
    fontSize: 16,
    color: "#9cd1ff",
    marginBottom: 6,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
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
  folderLabel: {
    marginTop: 10,
    fontSize: 20,
    color: "white",
    marginBottom: 6,
  },
  folderOption: {
    padding: 10,
    backgroundColor: "#222556",
    borderRadius: 6,
    marginVertical: 4,
  },
  folderOptionSelected: {
    backgroundColor: "#4459a8",
  },
  folderOptionText: {
    color: "white",
    fontSize: 18,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: { padding: 10, borderRadius: 8, width: "48%" },
  btnText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});