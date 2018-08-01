import React from 'react';
import { StyleSheet, ScrollView, View, Text, FlatList } from 'react-native';

export default class LeaderboarsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            title: `Leadearboards ${navigation.getParam('pvpMode')}`,
            headerStyle: { backgroundColor: '#47271a', borderBottomColor: '#f8b700', borderBottomWidth: 2, },
            headerTitleStyle: { color: '#f8b700' }
        }
        );
    }
    constructor(props) {
        super(props);
        const data = this.props.navigation.state.params.data;
        const list = []


        data.rows.forEach(row => {
            list.push({
                key: {
                    name: row.name,
                    ranking: row.ranking,
                    rating: row.rating,
                    realm: row.realmName
                }
            })
        });
        this.state = { flatList: list };
    }

    //todo dynamic list or something else (50elem for ex)
    _parseRows() {
        return (
            <FlatList
                data={this.state.flatList}
                renderItem={({ item }) =>  <Text style={styles.item}>{`${item.key.ranking}. ${item.key.name}-${item.key.realm}      ${item.key.rating}`}</Text>
                }
            />);
    }

    render() {
        //console.log(JSON.stringify(this.props.navigation.state.params));
        //console.log(this.state.icon);
        return (
            <ScrollView >
                <View style={styles.container}>
                    {this._parseRows()}

                </View>

            </ScrollView>);
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