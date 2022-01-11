import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
} from 'react-native';
import firebase from 'firebase';
import {
  Entypo,
  Fontisto,
  FontAwesome5,
  Octicons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
  }

  login = async (email, password) => {
    if (email && password) {
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        if (response) {
          this.props.navigation.navigate('HomeStack');
        }
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            Alert.alert("User doesn't exist");
            console.log('Doesnt exist');
            break;
          case 'auth/invalid-email':
            Alert.alert('incorrect mail addrees or password');
            console.log('invalid');
            break;
        }
      }
    }
  };
  forgotPassword = (emailAdress) => {
    if (emailAdress !== '') {
      firebase
        .auth()
        .sendPasswordResetEmail(emailAdress)
        .then(function () {
          alert('Reset password link has been sent to ur email');
        })
        .catch(function (error) {
          alert(error);
        });
    }
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ImageBackground
          source={require('../assets/back2.png')}
          style={styles.image}>
          <Image
            style={{
              alignSelf: 'center',
              width: '70%',
              height: 200,
              marginTop: 25,
            }}
            source={require('../assets/login.png')}
          />
            <KeyboardAvoidingView
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
            <View style={styles.inputContainer}>
              <View style={styles.iconStyle}>
                <Entypo name={'mail'} size={25} color="#0092D8" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => {
                  this.setState({ email: text });
                }}
                value={this.state.email}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconStyle}>
                <AntDesign name={'eye'} size={25} color="#0092D8" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
                value={this.state.password}
              />
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginRight: 5,
                marginTop: 10,
              }}
              onPress={() => {
                this.forgotPassword(this.state.email);
              }}>
              <Text style={{ fontSize: 16, color: 'black' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <LinearGradient
              colors={['#0092D8', '#38b6ff']}
              start={{ x: -5, y: -1 }}
              end={{ x: 5, y: 1 }}
              style={styles.signUpButton}>
              <TouchableOpacity
                style={{     
                  width: '80%',
                height: 50,
                marginTop: 30,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginBottom:10
              }}
                onPress={() => {
                  this.login(this.state.email, this.state.password);
                }}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>
            </LinearGradient>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginBox: {
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
    height: 40,
    textAlign: 'center',
    borderWidth: 4,
  },
  iconStyle: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#38b6ff',
    borderRightWidth: 1,
    width: 50,
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '95%',
    height: 50,
    borderColor: '#38b6ff',
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 18,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  signUpButton: {
    width: '80%',
    height: 50,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
    image:{
      flex:1, 
      justifyContent:"center", 
      alignItems:"center"
  },
});
