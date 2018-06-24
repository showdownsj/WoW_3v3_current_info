import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Picker, YellowBox } from 'react-native';
import axios from 'axios';
import * as Realms from './../resources/en_GBRealms.json';
YellowBox.ignoreWarnings(['Warning: Each child in an array or iterator should have a unique "key" prop']);
const generateRand = () => {
  return (Math.random() * 256) ^ 0;
};


const getFromBlizz = async (realm, name) => {
  const pathCharacterInfo = `https://eu.api.battle.net/wow/character/${realm}/${name}?fields=pvp&locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr`;//'https://us.api.battle.net/wow/leaderboard/3v3?locale=en_GB&apikey=6x24nk9hj6d4b7efp8a35rsxavtq7twr';
  const result = await axios.get(pathCharacterInfo);
  // console.log(result);
  return result;
};


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  constructor(props) {
    super(props);
    const pickerData = [];
    const realmNames = [];
    Realms.realms.forEach(realm => {
      realmNames.push(realm.name);
    });
    realmNames.sort();
    realmNames.forEach( realm => {
      pickerData.push(<Picker.Item label={realm} value={realm} />);
    });

    this.state = {
      name: '',
      realm: realmNames[0],
      pickerData: pickerData,
      error: false
    };

 
     this.onHandlePress = this.onHandlePress.bind(this);
  }


  async onHandlePress() {
    try{
    const data = await getFromBlizz(this.state.realm, this.state.name);
    this.setState({ color: `rgb(${generateRand()},${generateRand()},${generateRand()})`, error:false });
    this.props.navigation.navigate('Profile', { data: data});
    }
    catch(err){
      this.setState({error:true});
    }
  }
  render() {
  
    //console.log(this.state);
    return (
      <View style={styles.container}>
       {this.state.error && <View style={styles.wrong}><Text style={{color:'white'}}>{'Unkown player. Please check the input name/realm'}</Text></View>}
        <TextInput onChangeText={(text) => { this.setState({ name: text || this.state.name }) }} style={styles.button} />
        <Picker selectedValue={this.state.realm} onValueChange={(itemValue, itemIndex) => this.setState({ realm: itemValue })} style={styles.button} >
         
         {this.state.pickerData}
         
        </Picker>
        <TouchableOpacity onPress={this.onHandlePress} style={styles.button} >
          <Text > Press </Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 200
  },
  wrong: {
    alignItems: 'center',
    backgroundColor: 'red',
   
    padding: 10,
    width: 200
  },
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#DDDDDD'
  }
});
