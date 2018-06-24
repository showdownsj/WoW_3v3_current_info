import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Image} from 'react-native';


export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Player\'s details for 3v3',
  };
  constructor(props) {
    super(props);
    const data = this.props.navigation.state.params.data.data;
    const icon = this.props.navigation.state.params.icon;
    this.state =  {data:data, 
                  icon: `https://render-eu.worldofwarcraft.com/character/${data.thumbnail}` };
  }

  render() {
    //console.log(JSON.stringify(this.props.navigation.state.params));
    //console.log(this.state.icon);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{uri: this.state.icon}} style={{width: 84, height: 84, marginTop: 5}} />
        <FlatList
          data={[
            {key: `${this.state.data.name}-${this.state.data.realm}` },
            {key: `Rating: ${this.state.data.pvp.brackets.ARENA_BRACKET_3v3.rating}`},
            {key: `Games played: ${this.state.data.pvp.brackets.ARENA_BRACKET_3v3.seasonPlayed}`},
            {key: `Wins: ${this.state.data.pvp.brackets.ARENA_BRACKET_3v3.seasonWon}`},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 16,
    height: 44,
  },
})
