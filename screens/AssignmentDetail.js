import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
  Button,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Card, Header, Icon, Avatar } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
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
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Modal from 'react-native-modal';
export default class AssignmentDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: this.props.navigation.getParam('itemDetails')['teacherId'],
      assignmentId:
        this.props.navigation.getParam('itemDetails')['assignmentId'],
      assignmentTitle: this.props.navigation.getParam('itemDetails')['title'],
      additionalInfo:
        this.props.navigation.getParam('itemDetails')['description'],
      image: this.props.navigation.getParam('itemDetails')['image'],
      subjectName: this.props.navigation.getParam('itemDetails')['subjectName'],
      teacherRemark: '',
      description: '',
      modalVisible: false,
      image2:
        'https://pixselo.com/testimonial/neo-systek/dummy-placeholder-image-400x400/',
      studentId: firebase.auth().currentUser.email,
      completed: false,
    };
  }

  componentDidMount() {
    //query in responses collection to check if student responded already where assignmentId and studetnId

    db.collection('Responses')
      .where('studentId', '==', this.state.studentId)
      .where('assignmentId', '==', this.state.assignmentId)
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length == 0) {
          this.setState({
            teacherRemark: 'Awaiting submission',
          });
        } else {
          snapshot.docs.map((doc) => {
            var studentResponse = doc.data();
            this.setState({
              description: studentResponse.description,
              image2: studentResponse.image,
              teacherRemark: studentResponse.teacherRemark,
              completed: studentResponse.completed,
            });
          });
        }
      });
  }
  showModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={this.state.isModalVisible}
        backDropOpacity={0.4}>
        <View>
          <Card
            containerStyle={{
              width: 200,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <Avatar source={{ uri: this.state.image }} size={'large'} />
            <TouchableOpacity
              onPress={() => {
                this.setState({ isModalVisible: false });
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 10,
                  fontSize: 15,
                  textDecorationLine: 'underline',
                }}>
                CANCEL
              </Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>
    );
  };
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
      this.setState({ image2: uri });
      this.setState({
        modalVisible: false,
      });
    }
  };

  fetchImage = () => {
    var storageRef = firebase
      .storage()
      .ref()
      .child(
        'Responses/' +
          this.state.teacherId +
          '/' +
          this.state.assignmentId +
          '/' +
          this.state.studentId
      );
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image2: url });
        db.collection('Responses').add({
          assignmentTitle: this.state.assignmentTitle,
          description: this.state.description,
          studentId: this.state.studentId,
          assignmentId: this.state.assignmentId,
          teacherId: this.state.teacherId,
          image: url,
          teacherRemark: 'Evalution Pending',
          completed: false,
        });

      })
      .catch((error) => {
        Alert.alert('Something went wrong in media uplaod, try again');
        this.setState({
          image2:
            'https://pixselo.com/testimonial/neo-systek/dummy-placeholder-image-400x400/',
        });
      });
  };

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
  async addDetails() {
    if (this.state.description && this.state.image2 && this.state.studentId) {
      try {
        var uniqueId = this.createUniqueId();
        var response = await fetch(this.state.image2);
        var blob = await response.blob();

        var ref = firebase
          .storage()
          .ref()
          .child(
            'Responses/' +
              this.state.teacherId +
              '/' +
              this.state.assignmentId +
              '/' +
              this.state.studentId
          );
        ref
          .put(blob)
          .then((response) => {
            this.fetchImage();
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert(
        'Error',
        'All fields are required!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }
  render() {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F0F8FF' }}>
        <Header
          centerComponent={{
            text: 'Assignment Details',
            style: {
              fontWeight: 'bold',
              fontSize: 19,
              color: '#fff',
            },
          }}
          leftComponent={
            <Icon
              name="arrow-left"
              type="feather"
              color="#ffffff"
              onPress={() => this.props.navigation.goBack()}></Icon>
          }
          backgroundColor={'#0092D8'}
        />

        <View
          style={{
            flex: 1,
          }}>
          {this.showModal()}
          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              padding: 5,
              fontWeight: 'bold',
            }}>
            Assignment Title: {this.state.assignmentTitle}
          </Text>
          <ScrollView style={{ flex: 1 }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: 'white',
                padding: 10,
              }}>
              <Avatar
                source={{ uri: this.state.image }}
                size={'large'}
                onPress={() => {
                  this.setState({ isModalVisible: true });
                }}
                containerStyle={{ position: 'absolute', top: -20 }}
              />

              <Text
                style={{
                  marginTop: 50,
                  fontSize: 16,
                  padding: 5,
                }}>
                Subject: {this.state.subjectName}
              </Text>
              <Text
                style={{
                  padding: 5,
                  fontSize: 14,
                  flexWrap: 'wrap',
                }}>
                Additional Information: {this.state.additionalInfo}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  padding: 5,
                  flexWrap: 'wrap',
                  fontWeight: 'bold',
                }}>
                Teacher Remark: {this.state.teacherRemark}
              </Text>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#F0F8FF',
                  borderRadius: 20,
                }}>
                {this.state.completed ? (
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        padding: 5,
                        fontWeight: 'bold',
                      }}>
                      Assigment is complete. Check your response below
                    </Text>
                    <Avatar
                      rounded
                      size="large"
                      source={{
                        uri: this.state.image2,
                      }}
                      containerStyle={{ alignSelf: 'center', margin: 20 }}
                    />
                    <Text>{this.state.description}</Text>
                  </View>
                ) : (
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        padding: 5,
                        fontWeight: 'bold',
                      }}>
                      Add Response Below
                    </Text>
                    <View>
                      <Modal
                        style={styles.modalView}
                        isVisible={this.state.modalVisible}
                        backdropOpacity={0.4}
                        deviceWidth={Dimensions.get('window').width}
                        deviceHeight={Dimensions.get('window').height}
                        onBackdropPress={() =>
                          this.setState({ modalVisible: false })
                        }>
                        <View style={styles.modalMainView}>
                          <TouchableOpacity
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: -10,
                              padding: 0,
                            }}
                            onPress={() =>
                              this.setState({ modalVisible: false })
                            }>
                            <MaterialIcons
                              name="cancel"
                              size={24}
                              color="#2460a7ff"
                              onPress={() =>
                                this.setState({ modalVisible: false })
                              }
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              textAlign: 'center',
                              margin: 5,
                              padding: 5,
                            }}>
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
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10,
                              }}>
                              <Feather
                                name="camera"
                                size={24}
                                color="#2460a7ff"
                                onPress={() =>
                                  this.setState({ modalVisible: false })
                                }
                              />
                              <Text style={{ textAlign: 'center' }}>
                                Camera
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                this.selectPicture();
                              }}
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10,
                              }}>
                              <FontAwesome
                                name="photo"
                                size={24}
                                color="#2460a7ff"
                                onPress={() =>
                                  this.setState({ modalVisible: false })
                                }
                              />
                              <Text style={{ textAlign: 'center' }}>
                                Photos
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                    <Avatar
                      size="large"
                      source={{
                        uri: this.state.image2,
                      }}
                      onPress={() => {
                        this.setState({ modalVisible: true });
                      }}
                      containerStyle={{ alignSelf: 'center', margin: 20 }}
                    />
                    <TextInput
                      style={styles.inputFont}
                      placeholder={'Description'}
                      multiline={true}
                      numberOfLines={4}
                      placeholderTextColor={'black'}
                      value={this.state.description}
                      onChangeText={(description) =>
                        this.setState({ description })
                      }
                    />
                    <LinearGradient
                      // Button Linear Gradient
                      colors={['#0092D8', '#38b6ff']}
                      start={{ x: -5, y: -1 }}
                      end={{ x: 5, y: 1 }}
                      style={styles.signUpButton}>
                      <TouchableOpacity
                        onPress={() => {
                          this.login(this.state.email, this.state.password);
                        }}>
                        <Text style={styles.buttonText}>Submit</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                )}
              </View>
            </View>
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
  },
  updateButton: {
    width: '60%',
    height: 50,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#000',
    borderRadius: 20,
  },
  textinput: {
    marginTop: 5,
    marginBottom: 5,
    width: '80%',
    height: 50,
    borderColor: 'black',
    borderBottomWidth: 1.5,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  },
  inputFont: {
    width: '80%',
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
    marginTop: 10,
    alignSelf: 'center',
  },
  submitButton: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  signUpButton: {
    width: '50%',
    height: 50,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'center',
    marginLeft: 80,
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
