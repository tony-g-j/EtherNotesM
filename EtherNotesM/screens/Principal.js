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

// 1. ACEPTAR LA PROP 'navigation'
// Asumo que este componente está siendo renderizado por un Stack.Screenr
export default function Principal({ navigation }) {
  // --- Estados para UI y Data ---
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCarpetaVisible, setModalCarpetaVisible] = useState(false);

  // Estados para el formulario de notas
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [fecha, setFecha] = useState("");
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState("Personal");

  // Estados para la navegación y filtros
  const [notas, setNotas] = useState([]);
  const [editando, setEditando] = useState(null); // Índice de la nota a editar
  // Mantengo 'seccion' pero la uso para las vistas de Notas/Carpetas/Búsqueda.
  // Las secciones de 'Cuenta' y 'Configuracion' ahora usarán 'navigation'.
  const [seccion, setSeccion] = useState("notas"); // 'notas', 'folders', 'folder'
  const [carpetaVista, setCarpetaVista] = useState(null); // Carpeta seleccionada para ver
  const [searchText, setSearchText] = useState("");

  // Estado de las carpetas
  const [carpetasDisponibles, setCarpetasDisponibles] = useState([
    "Personal",
    "Escuela",
  ]);
  const [nuevaCarpetaNombre, setNuevaCarpetaNombre] = useState("");

  // --- Funciones de Lógica (sin cambios) ---

  const abrirModalNuevaNota = () => {
    // Limpiar estados para nueva nota
    setTitulo("");
    setSubtitulo("");
    setContenido("");
    setFecha("");
    setCarpetaSeleccionada("Personal");
    setEditando(null);
    setModalVisible(true);
  };

  const guardarNota = () => {
    if (!titulo.trim() || !contenido.trim()) return; // Validación básica

    const nuevaNota = {
      titulo,
      subtitulo,
      fecha: fecha || new Date().toLocaleDateString(), // Fecha predeterminada
      contenido,
      carpeta: carpetaSeleccionada,
    };

    if (editando !== null) {
      // Editar nota existente
      const nuevas = [...notas];
      nuevas[editando] = nuevaNota;
      setNotas(nuevas);
      setEditando(null);
    } else {
      // Crear nueva nota
      setNotas([...notas, nuevaNota]);
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
    // Usamos el índice para eliminar
    setNotas(notas.filter((_, idx) => idx !== i));
  };

  const agregarCarpeta = () => {
    if (nuevaCarpetaNombre.trim() === "") return;
    if (carpetasDisponibles.includes(nuevaCarpetaNombre.trim())) return;

    setCarpetasDisponibles([...carpetasDisponibles, nuevaCarpetaNombre.trim()]);
    setNuevaCarpetaNombre("");
    setModalCarpetaVisible(false);
  };

  // --- Memoización para Filtros (sin cambios) ---

  // Filtro principal de notas (sección 'notas')
  const notasFiltradasGeneral = useMemo(() => {
    if (seccion !== "notas" && seccion !== "folder") {
      return notas;
    }

    let filteredNotes = notas;

    // Filtrar por carpeta si estamos en la vista de carpeta
    if (seccion === "folder" && carpetaVista !== null) {
      filteredNotes = notas.filter((n) => n.carpeta === carpetaVista);
    }

    // Filtrar por búsqueda de texto
    if (searchText.trim() !== "") {
      const lowerSearchText = searchText.toLowerCase();
      filteredNotes = filteredNotes.filter(
        (n) =>
          n.titulo.toLowerCase().includes(lowerSearchText) ||
          n.contenido.toLowerCase().includes(lowerSearchText)
      );
    }

    return filteredNotes;
  }, [notas, seccion, searchText, carpetaVista]);

  // Filtro de carpetas (sección 'folders')
  const carpetasFiltradas = useMemo(() => {
    if (seccion !== "folders" || searchText.trim() === "") {
      return carpetasDisponibles;
    }
    const lowerSearchText = searchText.toLowerCase();

    return carpetasDisponibles.filter((c) =>
      c.toLowerCase().includes(lowerSearchText)
    );
  }, [carpetasDisponibles, seccion, searchText]);

  // --- Renderizado de Contenido Principal (Simplificado) ---

  const renderContenido = () => {
    // 1. Vista de Carpeta Individual
    if (seccion === "folder" && carpetaVista !== null) {
      const notasDeEstaCarpeta = notasFiltradasGeneral;

      return (
        <>
          <Text style={styles.title}>Carpeta: {carpetaVista}</Text>

          {notasDeEstaCarpeta.length === 0 && (
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textAlign: "center",
                marginTop: 50,
              }}
            >
              {searchText.trim() !== ""
                ? `No se encontraron notas con el título "${searchText}" en esta carpeta.`
                : "Sin notas aquí. Crea una nueva nota y asígnale esta carpeta."}
            </Text>
          )}

          {notasDeEstaCarpeta.map((n, index) => {
            // Necesitamos el índice original para editar/eliminar
            const originalIndex = notas.findIndex(
              (nota) =>
                nota.titulo === n.titulo &&
                nota.contenido === n.contenido &&
                nota.carpeta === n.carpeta
            );

            return (
              <View key={index} style={styles.noteBox}>
                <Text style={styles.noteTitle}>{n.titulo}</Text>
                <Text style={styles.noteSubtitle}>{n.subtitulo}</Text>
                <Text style={styles.noteDate}>Fecha: {n.fecha}</Text>
                <Text style={styles.noteContent} numberOfLines={3}>
                  {n.contenido}
                </Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity onPress={() => editarNota(originalIndex)}>
                    <Ionicons name="create-outline" size={30} color="#ffeb3b" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarNota(originalIndex)}>
                    <Ionicons name="trash-outline" size={30} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </>
      );
    }

    // 2. Vista de Listado de Carpetas
    if (seccion === "folders") {
      return (
        <>
          <Text style={styles.title}>
            Carpetas ({carpetasDisponibles.length})
          </Text>

          {carpetasFiltradas.length === 0 && (
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textAlign: "center",
                marginTop: 50,
              }}
            >
              {searchText.trim() !== ""
                ? `No se encontraron carpetas con el título "${searchText}".`
                : "Aún no tienes carpetas. ¡Crea una nueva!"}
            </Text>
          )}

          {carpetasFiltradas.map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.folderBox}
              onPress={() => {
                setCarpetaVista(c);
                setSeccion("folder");
                setSearchText(""); // Limpiar búsqueda al cambiar de vista
              }}
            >
              <Ionicons name="folder" size={30} color="#ffeb3b" />
              <Text style={styles.folderTitle}>{c}</Text>
              <Text style={styles.folderCount}>
                ({notas.filter((n) => n.carpeta === c).length} notas)
              </Text>
            </TouchableOpacity>
          ))}
        </>
      );
    }

    // **3. Vistas Genéricas (Configuración o Cuenta)**

    // 4. Vista de Todas las Notas (seccion 'notas' - Default)
    return (
      <>
        <Text style={styles.title}>
          Todas tus notas ({notasFiltradasGeneral.length})
        </Text>

        {notasFiltradasGeneral.length === 0 && (
          <Text
            style={{
              color: "white",
              fontSize: 20,
              textAlign: "center",
              marginTop: 50,
            }}
          >
            {searchText.trim() !== ""
              ? "No se encontraron notas con ese título."
              : "Aún no tienes notas. ¡Empieza a crear una!"}
          </Text>
        )}

        {notasFiltradasGeneral.map((n, index) => {
          // Necesitamos el índice original para editar/eliminar
          const originalIndex = notas.findIndex(
            (nota) =>
              nota.titulo === n.titulo &&
              nota.contenido === n.contenido &&
              nota.carpeta === n.carpeta
          );

          return (
            <View key={index} style={styles.noteBox}>
              <Text style={styles.noteTitle}>{n.titulo}</Text>
              <Text style={styles.noteSubtitle}>{n.subtitulo}</Text>
              <Text style={styles.noteDate}>Fecha: {n.fecha}</Text>

              <View style={styles.tagContainer}>
                <Ionicons name="folder-outline" size={16} color="#9cd1ff" />
                <Text style={styles.folderTag}>Carpeta: {n.carpeta}</Text>
              </View>

              <Text style={styles.noteContent} numberOfLines={3}>
                {n.contenido}
              </Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={() => editarNota(originalIndex)}>
                  <Ionicons name="create-outline" size={30} color="#ffeb3b" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => eliminarNota(originalIndex)}>
                  <Ionicons name="trash-outline" size={30} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra Superior (Búsqueda y Añadir) */}
      <View style={styles.topBar}>
        <Ionicons name="search" size={30} color="#bfbfd9" />

        <TextInput
          placeholder={
            seccion === "folders"
              ? "Buscar carpetas..."
              : "Buscar por Título o Contenido..."
          }
          placeholderTextColor="#7a7ca1ff"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          editable={
            seccion === "notas" || seccion === "folder" || seccion === "folders"
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (seccion === "folders") setModalCarpetaVisible(true);
            else abrirModalNuevaNota();
          }}
        >
          <Ionicons name="add" size={30} color="#bfbfd9" />
        </TouchableOpacity>
      </View>

      {/* Contenido Principal (Sidebar + ScrollView) */}
      <View style={styles.layout}>
        {/* Sidebar / Navegación */}
        <View style={styles.sidebar}>
          <TouchableOpacity
            style={[styles.navItem, seccion === "notas" && styles.navItemSelected]}
            onPress={() => {
              setSeccion("notas");
              setCarpetaVista(null);
              setSearchText("");
            }}
          >
            <Ionicons name="document-text-outline" size={30} color="white" />
            <Text style={styles.navText}>Notas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navItem,
              seccion === "folders" && styles.navItemSelected,
            ]}
            onPress={() => {
              setSeccion("folders");
              setCarpetaVista(null);
              setSearchText("");
            }}
          >
            <Ionicons name="folder-outline" size={30} color="white" />
            <Text style={styles.navText}>Carpetas</Text>
          </TouchableOpacity>

          {/* 2. IMPLEMENTACIÓN DE NAVIGATION EN CUENTA */}
          <TouchableOpacity
            style={[
              styles.navItem,
              // No usamos 'seccion === 'Cuenta'' porque navegaremos fuera
            ]}
            onPress={() => {
              // Navegar a la pantalla 'CuentaScreen'
              navigation.navigate('Cuenta');
            }}
          >
            <Ionicons name="person-circle-outline" size={30} color="white" />
            <Text style={styles.navText}>Cuenta</Text>
          </TouchableOpacity>

          {/* 2. IMPLEMENTACIÓN DE NAVIGATION EN CONFIGURACIÓN */}
          <TouchableOpacity
            style={[
              styles.navItem,
              { marginTop: "auto" },
              // No usamos 'seccion === 'Configuracion'' porque navegaremos fuera
            ]}
            onPress={() => {
              // Navegar a la pantalla 'ConfiguracionScreen'
              navigation.navigate('Configuracion');
            }}
          >
            <Ionicons name="settings-outline" size={30} color="white" />
            <Text style={styles.navText}>configuracion</Text>
          </TouchableOpacity>
        </View>

        {/* Área de Contenido Dinámico */}
        <ScrollView style={styles.mainContent}>
          {renderContenido()}
        </ScrollView>
      </View>

      {/* Modal de Nueva/Editar Nota (sin cambios) */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editando !== null ? "Editar nota" : "Nueva nota"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título (Obligatorio)"
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
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              placeholder="Contenido de la nota (Obligatorio)"
              placeholderTextColor="#bfbfd9"
              multiline
              value={contenido}
              onChangeText={setContenido}
            />

            <Text style={styles.folderLabel}>
              Carpeta seleccionada: {carpetaSeleccionada}
            </Text>

            <ScrollView
              style={{
                maxHeight: 100,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#222556",
                borderRadius: 8,
              }}
            >
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

      {/* Modal de Nueva Carpeta (sin cambios) */}
      <Modal
        animationType="slide"
        transparent
        visible={modalCarpetaVisible}
        onRequestClose={() => setModalCarpetaVisible(false)}
      >
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

// Los estilos se mantienen exactamente igual.
const styles = StyleSheet.create({
  // Se mantiene el fondo oscuro para consistencia con el tema que elegiste
  container: { flex: 1, backgroundColor: "#0f172a" },
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
  addButton: {
    backgroundColor: "#22375a",
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
  navItem: {
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
  },
  navItemSelected: {
    backgroundColor: "#222556",
    borderLeftColor: "#ffeb3b", // Color de resalte para la navegación
    borderLeftWidth: 4,
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
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
    // Se añaden bordes para mejor separación visual
    borderBottomWidth: 1,
    borderBottomColor: "#222556",
    paddingBottom: 10,
  },
  noteBox: {
    backgroundColor: "#22375a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  noteTitle: { fontSize: 26, fontWeight: "bold", color: "white" },
  noteSubtitle: { fontSize: 20, color: "#d1d1d1" },
  noteDate: { fontSize: 16, color: "#b7b7b7", marginBottom: 10 },
  noteContent: { fontSize: 18, color: "white", marginBottom: 10 },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 5,
  },
  folderTag: {
    fontSize: 16,
    color: "#9cd1ff",
    marginBottom: 6,
  },
  folderBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22375a", // Mismo fondo que noteBox
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  folderTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  folderCount: {
    fontSize: 18,
    color: "#b7b7b7",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#222556",
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
    borderWidth: 1,
    borderColor: "#475569",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "white",
    textAlign: "center",
  },
  input: {
    fontSize: 18,
    backgroundColor: "#222556",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    color: "white",
    borderWidth: 1,
    borderColor: "#475569",
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