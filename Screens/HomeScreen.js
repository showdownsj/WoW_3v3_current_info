import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Picker, YellowBox, Keyboard } from 'react-native';

import axios from 'axios';
import * as Realms from './../resources/en_GBRealms.json';


/* get requests:
https://eu.api.battle.net/wow/data/character/classes?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr   classes
https://eu.api.battle.net/wow/data/character/achievements?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr allachieve
https://us.api.battle.net/wow/leaderboard/3v3?locale=en_US&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr    leaderdb.
https://us.api.battle.net/wow/character/test-realm/Peratryn?fields=achievements&locale=en_US&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr
test */
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
  const path = `https://eu.api.battle.net/wow/leaderboard/${mode}?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr`;
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
      const titles = await this.getTitles();
      // console.log(JSON.stringify(stats));
      //console.log(stats.data.statistics.subCategories[9].subCategories[0].statistics[24].quantity);
      this.props.navigation.navigate('Profile', { data: dataPvp, statistics: dataStats, pvpMode: this.state.pvpMode, titles });
    }
    catch (err) {
      console.log(err);
      this.setState({ error: true });
    }
  }

  async getTitlesList(){
    const data = await getAchievesList();//getCharacterFields("Karazhan", "Jinkis", 'achievements');
    const pvpAchi = data.data.achievements[12].categories[3];
    const duelistList = [];
    const gladiatorList = [];
    const roneList = [];
    for (let achi of pvpAchi.achievements){
      //console.log(achi.title);
      if(!achi.title.indexOf('Duelist:')){
          duelistList.push(achi);
      } else if(!achi.title.indexOf('Gladiator:')) {
          gladiatorList.push(achi);
      } else if(achi.title.indexOf('Gladiator:') > 0){
          roneList.push(achi);
      }
    }
    return {// roneList: roneList.slice(-4,-1),
             roneList: roneList,
             gladiatorList: gladiatorList, 
             duelistList: duelistList
           };
  }
  
  async getTitles(){
    const titleList = await this.getTitlesList();
    const charAchis = await getCharacterFields(this.state.realm, this.state.name, 'achievements');
    const charTitles = charAchis.data.achievements.achievementsCompleted; 
    const roneCompleted = [];
    const gladCompleted = [];
    const duelistCompleted = [];
    for(let title of titleList.roneList){
      if(charTitles.includes(title.id)){
          roneCompleted.push(title);
      }
    }

    for(let title of titleList.gladiatorList){
      if(charTitles.includes(title.id)){
        gladCompleted.push(title);
      }
    }

    for(let title of titleList.duelistList){
      if(charTitles.includes(title.id)){
        duelistCompleted .push(title);
      }
    }
    return { rone: roneCompleted,
             gladiator: gladCompleted,
             duelist: duelistCompleted
    }
  }

  async onTests() {
    try{
     // const data = await getLeaderboard(this.state.pvpMode);
      //this.props.navigation.navigate('Leaderboards', { data: data.data, pvpMode: this.state.pvpMode });
        //const data = await getAchievesList();
        const data = await this.getTitles();
        console.log(JSON.stringify(data));
        //console.log(pvpAchi);
         axios.post('http://172.22.4.177:19005/achieves', {
          data: JSON.stringify(data)
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });  
   
          //console.log(JSON.stringify(duelistList),JSON.stringify(gladiatorList), JSON.stringify(roneList));
          
        
       // console.log(JSON.stringify(titles));
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
