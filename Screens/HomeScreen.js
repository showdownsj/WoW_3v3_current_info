import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Picker, YellowBox, Keyboard } from 'react-native';

import axios from 'axios';
import * as Realms from './../resources/en_GBRealms.json';


/* get requests:
https://eu.api.battle.net/wow/data/character/classes?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr   classes
https://eu.api.battle.net/wow/data/character/achievements?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr allachieve
https://us.api.battle.net/wow/leaderboard/3v3?locale=en_US&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr    leaderdb.
https://us.api.battle.net/wow/character/test-realm/Peratryn?fields=achievements&locale=en_US&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr
 */
YellowBox.ignoreWarnings(['Warning: Each child in an array or iterator should have a unique "key" prop', 'Warning: Failed prop type: Invalid props.style key `color` supplied to `View`']);
const generateRand = () => {
  return (Math.random() * 256) ^ 0;
};


const getCharacterFields = async (realm, name, field) => {
  const path = `https://eu.api.battle.net/wow/character/${realm}/${name}?fields=${field}&locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr`;
  //'https://us.api.battle.net/wow/leaderboard/3v3?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr';
  const result = await axios.get(path);
  return result;
};

const getClassesList = async () => {
  const path = 'https://eu.api.battle.net/wow/data/character/classes?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr';
  return (await axios.get(path));
};

const getAchievesList = async () => {
  const path = 'https://eu.api.battle.net/wow/data/character/achievements?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr';
  return (await axios.get(path));
};

const getLeaderboard = async (mode) => {
  const path = `https://eu.api.battle.net/wow/leaderboard/3v3?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr`;
  return (await axios.get(path));
};

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
    headerStyle: { backgroundColor: '#47271a', borderBottomColor: '#f8b700', borderBottomWidth: 2, },
    headerTitleStyle: { color: '#f8b700' },

  };

  constructor(props) {
    super(props);
    const pickerData = [];
    const realmNames = [];
    Realms.realms.forEach(realm => {
      realmNames.push(realm.name);
    });
    realmNames.sort();
    realmNames.forEach(realm => {
      pickerData.push(<Picker.Item key={pickerData.length} label={realm} value={realm} />);
    });

    this.state = {
      name: '',
      realm: realmNames[0],
      pickerData: pickerData,
      error: false,
      pvpMode: '3v3'
    };

    this.onTests = this.onTests.bind(this);
    this.onHandlePress = this.onHandlePress.bind(this);
  }


  async onHandlePress() {
    try {
      const dataPvp = await getCharacterFields(this.state.realm, this.state.name, 'pvp');
      const dataStats = await  getCharacterFields(this.state.realm, this.state.name, 'statistics');
    // console.log(JSON.stringify(stats));
      //console.log(stats.data.statistics.subCategories[9].subCategories[0].statistics[24].quantity);
      this.props.navigation.navigate('Profile', { data: dataPvp, statistics: dataStats, pvpMode: this.state.pvpMode });
    }
    catch (err) {
      console.log(err);
      this.setState({ error: true });
    }
  }

  async onTests() {
    try{
        const data = await getAchievesList();
        //console.log(JSON.stringify(data.data));
        axios.post('http://172.22.4.177:19005/achieves', {
          data: JSON.stringify(data)
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
        /*await axios({
          method: 'post',
          url: 'http://172.22.4.177/achieves',
          data: data
        });*/
    }
    catch(err){

    }
  }

  containerTouched(event) {
    this.refs.textInput.blur();
    return false;
  }

  render() {

    //console.log(this.state);
    return (

      <View style={styles.container} onStartShouldSetResponder={this.containerTouched.bind(this)}>
        {this.state.error && <View style={styles.wrong}><Text style={{ color: 'white', textAlign: 'center', fontSize: 14, fontFamily: 'Roboto' }}>{'Unkown player. Please check the input name/realm'}</Text></View>}
        <TextInput ref='textInput'
          onChangeText={(text) => { this.setState({ name: text || this.state.name }) }}
          style={styles.textInput}
          onSubmit={Keyboard.dismiss}
          placeholder='Character name'
          placeholderTextColor={'#f8b700'}
          clearTextOnFocus={true}
          underlineColorAndroid='transparent'
        />
        <Picker selectedValue={this.state.realm} onValueChange={(itemValue, itemIndex) => { this.setState({ realm: itemValue }); Keyboard.dismiss()} } style={styles.picker} >
            {this.state.pickerData}
        </Picker>
        <Picker selectedValue={this.state.pvpMode}
          onValueChange={(itemValue, itemIndex) =>{ this.setState({ pvpMode: itemValue }); Keyboard.dismiss()} }
          style={styles.picker}>
          <Picker.Item label='2v2' value='2v2' />
          <Picker.Item label='3v3' value='3v3' />
          <Picker.Item label='RBG' value='RBG' />
        </Picker>
        <TouchableOpacity onPress={this.onHandlePress} style={styles.button} >
          <Text style={{ color: '#f8b700' }}> Press </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onTests} style={styles.button} >
          <Text style={{ color: '#f8b700' }}> TestGetRequests </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#211510',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    marginTop: 15,
    borderRadius: 5,
    backgroundColor: '#89320f',
    color: '#f8b700',
    padding: 10,
    width: 250
  },
  picker: {
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 5,
    backgroundColor: '#89320f',
    color: '#f8b700',
    padding: 10,
    width: 250,
  },

  button: {
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#89320f',
    alignItems: 'center',
    color: '#f8b700',
    padding: 10,
    width: 250
  },
  wrong: {
    alignItems: 'center',
    backgroundColor: '#c12501',
    padding: 10,
    width: 250
  }
});
