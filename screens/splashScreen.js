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
      email: 'doge.iv2007@gmail.com',
      password: 'amogh@2411',
    };
  }

  login = async (email, password) => {
    if (email && password) {
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        if (response) {
          this.props.navigation.navigate('List');
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ImageBackground
          source={require('../assets/splashS1.png')}
          style={styles.image}>
          <LinearGradient
            // Button Linear Gradient
            colors={['#0092D8', '#38b6ff']}
            start={{ x: -5, y: -1 }}
            end={{ x: 5, y: 1 }}
           style={styles.getStartedButton}>
            <TouchableOpacity
             
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image:{
      flex:1, 
      justifyContent:"flex-end", 
      alignItems:"flex-end"
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  getStartedButton: {
    width: '45%',
    padding:5,
    height: 40,
    marginBottom: 70,
    marginRight:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00ADD8',
    borderRadius: 10,
  },
});
