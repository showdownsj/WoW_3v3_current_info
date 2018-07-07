import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Image } from 'react-native';

const CLASSES_COLORS = [
    '#c79c6e', //war
    '#f58cba', //pal
    '#abd473', //hunter
    '#fff569',//rogue
    '#ffffff',//priest
    '#c41f3b',//dk
    '#0070de',//shaman
    '#69ccf0',//mage
    '#9482c9',//warlock
    '#00ff96',//monk
    '#ff7d0a', //druid
    '#a330c9', //dh
];

export default class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return ({
      title: `Player\'s details for ${navigation.getParam('pvpMode')}`,
      headerStyle: { backgroundColor: '#47271a', borderBottomColor: '#f8b700', borderBottomWidth: 2, },
      headerTitleStyle: { color: '#f8b700' }
    }
    );
  };
  constructor(props) {
    super(props);
    const data = this.props.navigation.state.params.data.data;
    const statistics = this.props.navigation.state.params.statistics;
    const pvpMode = this.props.navigation.state.params.pvpMode;
    this.state = {
      data: this._parseDataViaPVPMode(pvpMode, data, statistics),
      class: data.class - 1,
      icon: `https://render-eu.worldofwarcraft.com/character/${data.thumbnail}`
    };
  }


  _parseDataViaPVPMode(pvpMode, data, statistics) {

    let arenaData;

    switch (pvpMode) {
      case '3v3':
        arenaData = {
          name: `${data.name}-${data.realm}`,
          rating: data.pvp.brackets.ARENA_BRACKET_3v3.rating,
          seasonPlayed: data.pvp.brackets.ARENA_BRACKET_3v3.seasonPlayed,
          seasonWon: data.pvp.brackets.ARENA_BRACKET_3v3.seasonWon,
          highestRating: statistics.data.statistics.subCategories[9].subCategories[0].statistics[24].quantity
        };
        return arenaData; break;

      case '2v2':
        arenaData = {
          name: `${data.name}-${data.realm}`,
          rating: data.pvp.brackets.ARENA_BRACKET_2v2.rating,
          seasonPlayed: data.pvp.brackets.ARENA_BRACKET_2v2.seasonPlayed,
          seasonWon: data.pvp.brackets.ARENA_BRACKET_2v2.seasonWon,
          highestRating: statistics.data.statistics.subCategories[9].subCategories[0].statistics[25].quantity
        };
        return arenaData; break;

      case 'RBG':
        arenaData = {
          name: `${data.name}-${data.realm}`,
          rating: data.pvp.brackets.ARENA_BRACKET_RBG.rating,
          seasonPlayed: data.pvp.brackets.ARENA_BRACKET_RBG.seasonPlayed,
          seasonWon: data.pvp.brackets.ARENA_BRACKET_RBG.seasonWon
        };
        return arenaData; break;

      default: return null;
    }

  }

  render() {
    //console.log(JSON.stringify(this.props.navigation.state.params));
    //console.log(this.state.icon);
    return (
      <View style={styles.container}>
        <Image source={{ uri: this.state.icon }} style={{ width: 84, height: 84, marginTop: 10 }} />
        <Text style={{  padding: 10, fontSize: 16, height: 44, color: CLASSES_COLORS[this.state.class]}}>
            {this.state.data.name}
        </Text>
        <FlatList
          data={[
            { key: `Rating: ${this.state.data.rating}` },
            { key: `Games played: ${this.state.data.seasonPlayed}` },
            { key: `Wins: ${this.state.data.seasonWon}` },
            { key: this.state.data.highestRating ? `Highest personal rating: ${this.state.data.highestRating}`:''}
          ]}
          renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#211510',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 10,
    fontSize: 16,
    height: 44,
    color: '#f8b700',
  },
})
