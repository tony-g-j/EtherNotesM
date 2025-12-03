import { Text, StyleSheet, View, TextInput, ActivityIndicator, Dimensions, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import Svg, { Path } from "react-native-svg";
const {width, height} = Dimensions.get('window');


const PantallaInicial = () => {
    return (
        <View style={styles.pantallaInicialContainer}>

            <Text style={styles.inicioAppText}>ETERNOTES</Text>
            <ActivityIndicator size="large" color="white" style={{marginTop: 40}}/>

        </View>
    )
}


const Login = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const mostrarModal = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  }

  return (
    <View style={stylesLogin.containerLogin}>

    <Modal
      animationType='fade'
      transparent={true}
      visible={modalVisible}
      onRequestClose={cerrarModal}
    >

      <View style={modalStyles.modalContainer}>

      <View style={modalStyles.modalView}>
        <Text style={modalStyles.modalTitle}>Recuperar Contraseña</Text>
        
        <Text style={modalStyles.modalText}> Ingresa el correo electrónico asociado a tu cuenta </Text>

        <TextInput
        
          style={[stylesLogin.input, {marginBottom: 20, marginTop: 10, zIndex: 99}]}
          placeholder="Tu correo electrónico"
          placeholderTextColor="#191A2C"
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <View style={{minHeight: 20, marginBottom: 15}} />

        <View style={modalStyles.buttonContainer}>

          <TouchableOpacity style={[modalStyles.button, modalStyles.buttonClose]} onPress={cerrarModal}>
            <Text style={modalStyles.textStyle}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[modalStyles.button, modalStyles.buttonSend]}>
            <Text style={modalStyles.textStyle}>Enviar</Text>
          </TouchableOpacity>

        </View>
      </View>

      </View>

    </Modal>
    

      <View style={stylesLogin.disenoSuperior}>
        <Svg
          width={412}
          height={200}
          fill="none"
        >
          <Path
            fill="#191A2C"
            d="M0 0h412v150.242s-53.5 111.955-206 0c-152.5-111.954-206 0-206 0V0Z"/>
        </Svg>
      </View>

      <Text style={stylesLogin.titulo}>Inicio de sesión</Text>

      <TextInput
        style={stylesLogin.input}
        placeholder="Correo electronico"
        placeholderTextColor="#191A2C"
      />

      <TextInput
        style={stylesLogin.input}
        placeholder="Contraseña"
        placeholderTextColor="#191A2C"
      />

      <TouchableOpacity style={stylesLogin.botonSesion}>
        <Text style={stylesLogin.botonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <View style={stylesLogin.linksContainer}>

        <TouchableOpacity onPress={mostrarModal}>
          <Text style={stylesLogin.linkText}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={stylesLogin.linkText}>Crear cuenta</Text>
        </TouchableOpacity>

      </View>

      <View style={stylesLogin.disenoInferior}>
        <Svg
          width={412}
          height={199}
          fill="none"
        >
          <Path
           fill="#191A2C"
           d="M0 48.122s53 108.274 206 0 206 0 206 0V200H0V48.122Z"/>
        </Svg>
      </View>


    </View>

    
  );

}

export default function InicioSesion() {
    const [inicioApp, setInicioApp] = useState(true);

    useEffect( () => {
      const tiempo = setTimeout(() => {
        setInicioApp(false);
      }, 3000);

      return () => clearTimeout(tiempo);
    }, []);



    if (inicioApp) {
      return <PantallaInicial/>;
      } else {
      return (
        <Login/>
      )
    }

   
}
    

const styles = StyleSheet.create({

  pantallaInicialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B2D45',
  },

  inicioAppText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },

});

const stylesLogin = StyleSheet.create({

  containerLogin: {
    flex: 1,
    backgroundColor: '#1B2D45',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  disenoSuperior: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 0,
  },

  disenoInferior: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 0,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
    color: '#ffff',
    zIndex: 10,
  },

  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    fontFamily: 'Montserrat',
    zIndex: 10,
  },

  botonSesion: {
    width: '100%',
    height: 50,
    backgroundColor: '#191A2C',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    zIndex: 10,
  },

  botonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
    zIndex: 10,
  },

  linkText: {
    color: 'white',
    fontSize: 14,
  },


});

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1B2D45',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#E5E7EB',
    fontSize: 14,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonClose: {
    backgroundColor: '#6B7280',
  },

  buttonSend: {
    backgroundColor: '#191A2C',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
