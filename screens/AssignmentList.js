import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ListItem, Avatar, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
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

export default class AssignmentListScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      studentId: firebase.auth().currentUser.email,
      assignment: [],
      teacherId: '',
    };
  }

  async getAssignments() {
    await db
      .collection('allStudents')
      .where('studentEmail', '==', this.state.studentId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          var studentDetail = doc.data();
          console.log(studentDetail);
          this.setState({
            teacherId: studentDetail.teacherId,
          });

          db.collection('Assignment')
            .where('teacherId', '==', this.state.teacherId)
            .onSnapshot((snapshot) => {
              var allAssignment = [];
              snapshot.docs.map((doc) => {
                var assignment = doc.data();
                allAssignment.push(assignment);
              });
              this.setState({
                assignment: allAssignment,
              });
            });
        });
      });
  }

  componentDidMount() {
    this.getAssignments();
  }
  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate('AssignmentDetails', {
          itemDetails: item,
        });
      }}
      style={styles.cardContainer}>
      <Image
        source={{
          uri: item.image,
        }}
        style={styles.img}
      />
      <View
        style={{
          flexDirection: 'column',
          paddingLeft: 10,
          width: '100%',
        }}>
        <Text
          style={[styles.input, { fontWeight: 'bold' }]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {item.title}
        </Text>
        <Text
          style={[styles.input, { fontSize: 14 }]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {item.subjectName}
        </Text>
        <Text
          style={[styles.input, { fontSize: 14 }]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
  keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F0F8FF' }}>
        <Header
          centerComponent={{
            text: 'Assignment List',
            style: {
              margin: 2,
              padding: 2,
              fontWeight: 'bold',
              fontSize: 19,
              color: '#fff',
            },
          }}
          backgroundColor={'#0092D8'}
          rightComponent={
            <Icon
              name="user"
              type="feather"
              color="#ffffff"
              onPress={() => this.props.navigation.navigate('Profile')}></Icon>
          }
        />

        <FlatList
          data={this.state.assignment}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 30,
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 25,
  },
  touchableOpacityStyle2: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 30,
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 25,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  fabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    alignSelf: 'center',
  },
  fabText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 35,
    alignSelf: 'center',
  },
  cardContainer: {
    margin: 5,
    borderRadius: 10,
    padding: 5,
    borderWidth: 2,
    borderColor: '#38b6ff',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    width: '60%',
    fontSize: 16,
    padding: 5,
  },
  img: {
    width: '30%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
