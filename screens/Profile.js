import * as React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import { Header, Icon, Avatar } from 'react-native-elements';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Entypo,
  Fontisto,
  FontAwesome5,
  FontAwesome,
  Octicons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Modal from 'react-native-modal';
export default class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      email: firebase.auth().currentUser.email,
      name: '',
      contact: '',
      docID: '',
      image:
        '#',
    };
  }

  takePhotoFromCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      cameraPermissions: status === 'granted',
    });
    if (this.state.cameraPermissions) {
      await ImagePicker.launchCameraAsync({
        compressImageMaxWidth: 290,
        compressImageMaxHeight: 290,
        cropping: true,
        compressImageQuality: 0.9,
      }).then((image) => {
        this.setState({ image: image.uri });
        console.log('Worked' + this.state.image);
        this.setState({
          modalVisible: false,
        });
      });
    } else {
      return alert('Permissions Not Granted').then(() => {
        this.setState({
          modalVisible: false,
        });
      });
    }
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    this.setState({
      modalVisible: false,
    });
    if (!cancelled) {
      this.setState({ image: uri });
      console.log('Worked' + this.state.image);
      this.setState({
        modalVisible: false,
      });
    }
  };

  fetchImage = (email) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('studentProfiles/' + email);
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
        db.collection('allStudents').doc(this.state.docID).update({
          studentEmail: firebase.auth().currentUser.email,
          studentContact: this.state.contact,
          image: this.state.image,
        });
        Alert.alert('Profile Updated');
        alert('Profile updated');
      })
      .catch((error) => {
        console.log('error' + error);
        Alert.alert('Something went wrong in media uplaod, try again');
        this.setState({
          image:
            'https://pixselo.com/testimonial/neo-systek/dummy-placeholder-image-400x400/',
        });
      });
  };

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
  updateDetails = async () => {
    try {
      var response = await fetch(this.state.image);
      var blob = await response.blob();
      var ref = firebase
        .storage()
        .ref()
        .child('studentProfiles/' + this.state.email);
      ref
        .put(blob)
        .then((response) => {
          this.fetchImage(this.state.email);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUserDetails = () => {
    var email = this.state.email;
    db.collection('allStudents')
      .where('studentEmail', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            name: data.studentName,
            contact: data.studentContact,
            docID: doc.id,
            image: data.image,
          });
        });
      });
  };

  componentDidMount() {
    this.getUserDetails();
  }
  render() {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F0F8FF' }}>
        <View style={{ flex: 1 }}>
          <Header
            centerComponent={{
              text: 'Profile',
              style: {
                margin: 2,
                padding: 2,
                fontWeight: 'bold',
                fontSize: 19,
                color: '#fff',
              },
            }}
            backgroundColor={'#0092D8'}
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#ffffff"
                onPress={() => this.props.navigation.goBack()}></Icon>
            }
                        rightComponent={
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color="#fff"
                style={{ marginTop: 5 }}
                onPress={() => {
                  this.logout();
                }}
              />
            }
          />
          <View>
            <Modal
              style={styles.modalView}
              isVisible={this.state.modalVisible}
              backdropOpacity={0.4}
              deviceWidth={Dimensions.get('window').width}
              deviceHeight={Dimensions.get('window').height}
              onBackdropPress={() => this.setState({ modalVisible: false })}>
              <View style={styles.modalMainView}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: -13,
                    right: -10,
                    margin: 10,
                    padding: 10,
                  }}
                  onPress={() => this.setState({ modalVisible: false })}>
                  <MaterialIcons
                    name="cancel"
                    size={24}
                    color="#2460a7ff"
                    onPress={() => this.setState({ modalVisible: false })}
                  />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', margin: 5, padding: 5 }}>
                  Choose An Option
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.takePhotoFromCamera();
                    }}
                    style={{
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <Feather
                      name="camera"
                      size={24}
                      color="#2460a7ff"
                      onPress={() => this.setState({ modalVisible: false })}
                    />
                    <Text style={{ textAlign: 'center' }}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.selectPicture();
                    }}
                    style={{
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <FontAwesome
                      name="photo"
                      size={24}
                      color="#2460a7ff"
                      onPress={() => this.setState({ modalVisible: false })}
                    />
                    <Text style={{ textAlign: 'center' }}>Photos</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          <ScrollView
            style={{
              width: '100%',
              backgroundColor: '#F0F8FF',
            }}>
            <KeyboardAvoidingView>
              <Avatar
                rounded
                source={{
                  uri: this.state.image,
                }}
                onPress={() => {
                  this.setState({ modalVisible: true });
                }}
                size="large"
                containerStyle={styles.imageContainer}
              />
              <Text
                style={{ marginTop: 10, color: '5ce1e6', alignSelf: 'center' }}>
                {this.state.email}
              </Text>
              <TextInput
                style={styles.textinput}
                placeholder={'First name'}
                onChangeText={(text) => {
                  this.setState({
                    name: text,
                  });
                }}
                value={this.state.name}
              />
              <TextInput
                style={styles.textinput}
                placeholder={'Contact'}
                maxLength={10}
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  this.setState({
                    contact: text,
                  });
                }}
                value={this.state.contact}
              />
           
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => {
                  this.updateDetails();
                }}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: 20,
    marginTop:10
  },
  imageContainer: {
    marginTop: 100,
    alignSelf: 'center',
  },
  updateButton: {
    width: '80%',
    height: 50,
    marginTop: 30,
    marginBottom:30, 
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#00ADD8',
    borderRadius: 20,
  },
  textinput: {
    marginTop: 5,
    marginBottom: 5,
    width: '85%',
    height: 50,
    borderColor: '#38b6ff',
    borderRadius: 20,
    borderBottomWidth: 1.5,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  }, 
  modalView: {
    alignSelf: 'center',
    borderColor: '#bbbb',
    width: '60%',
    height: '60%',
  },
  modalMainView: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowColor: '#bbbb',
  },
});
