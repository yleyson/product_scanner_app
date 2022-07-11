import React from 'react'
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';

export default function IngredientsCard({ ingredients }) {
    return (
        <FlatList
            data={ingredients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.ingredientsView}>
                    <Text>{item.name}</Text>
                    <Text>{item.desc}</Text>
                </View>

            )}
        />
    )
}


const styles = StyleSheet.create({
    ingredientsView: {
        flex: 1,
        flexDirection: 'column',
        borderWidth: 4,
        borderColor: 'black',
        marginBottom: 10,
        padding: 5

    }
});
