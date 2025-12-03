import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

export default function Cuenta() {


  const navigation = useNavigation();

  return (
    <View style={styles.MainContainer}>
      <View style={styles.Superior}>
        <Svg width={412} height={150} fill="none">
          <Path
            fill="#191A2C"
            d={`
                M 0 0 
                L 412 0             
                L 412 120            
                Q 412 150 380 150    
                C 300 150 360 52 206 52  
                C 52 52 112 150 32 150  
                Q -12.5 150 0 120        
                Z
            `}
          />
        </Svg>
      </View>

      <View style={styles.content}>
        <Image
          style={styles.profileImg}
          source={require("../assets/favicon.png")}
          resizeMode="cover"
        />

        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.textN}>
              <Text style={styles.textB}>Nombre: </Text>
              Pepe Pecas
            </Text>
          </View>

          <View style={styles.subContainer}>
            <Text style={styles.textN}>
              <Text style={styles.textB}>Correo: </Text>
              Paco123@gmail.com
            </Text>
          </View>

          {/* 🔥 YA FUNCIONA */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Principal")}
          >
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>

          <View style={styles.subContainer}>
            <Text style={[styles.textB, { textAlign: 'center' }]}>
              Contraseña:
            </Text>
            <TouchableOpacity style={styles.btn1}>
              <Text style={[styles.textB, { color: '#FFF' }]}>
                Cambiar Contraseña
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subContainer}>
            <Text style={[styles.textB, { textAlign:'center' }]}>
              Ajustes de la cuenta
            </Text>

            <TouchableOpacity style={styles.btn1}>
              <Text style={[styles.textB, { color: '#FFF' }]}>
                Borrar Historial
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn1}>
              <Text style={[styles.textB, { color: '#FFF' }]}>
                Borrar Notas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn1}>
              <Text style={[styles.textB, { color: '#FFF' }]}>
                Desactivar Cuenta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn1}>
              <Text style={[styles.textB, { color: '#FFF' }]}>
                Eliminar Cuenta
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <View style={styles.footer}>
        <Svg width={412} height={150} fill="none">
          <Path
            fill="#191A2C"
            d="M0 48.122s53 108.274 206 0 206 0 206 0V200H0V48.122Z"
          />
        </Svg>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#1B2D45", 
    alignItems: "center",
    justifyContent: "center"
  },
  Superior: {
    position: "absolute",
    top: 0,
    zIndex: 0,
    left: 0
  },
  profileImg: {
    height: 150,
    width: 150,
    top: "6.8%",
    borderRadius: 100, 
    borderWidth: 2,
    borderColor: "#BCBAC7"
  },
  content: {
    flex: 1,
    gap: 140, 
    alignItems: "center"
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0
  },
  container: {
    flex: 1,
    maxHeight: 450,
    width: width * 0.9, 
    gap: 11,
    alignItems: "center"
  },
  subContainer: {
    width: width * 0.65, 
    justifyContent: "center",
    backgroundColor: "#D9D9D9", 
    borderRadius: 16,
    padding: 12
  },
  textB: {
    fontSize: 18,
    fontWeight: "bold"
  },
  textN: {
    fontWeight: "normal",
    fontSize: 17
  },
  btn1: {
    backgroundColor: '#191A2C',
    borderRadius: 16,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
    backButton: {
    backgroundColor: "#1a1a42",
    padding: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginTop: 20,
  },

  backText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});