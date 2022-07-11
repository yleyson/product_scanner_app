import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native';

import CameraButton from '../Components/CameraButton'




export default function HomePage({ navigation }) {

    return (
        <View style={styles.container}>

            <View style={styles.button_container}>
                <CameraButton navigation={navigation} />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button_container: {
    }
});

