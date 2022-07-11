import React from "react";
import { View, Text, Alert, Image, StyleSheet, ImageBackground } from 'react-native'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import image from '../assets/food_scanner.png'

const CustomDrawer = (props) => {
    const str_user = props.user === null ? "משתמש לא מחובר" : `שלום ${props.user.user_name}`
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                contentContainerStyle={{ backgroundColor: '#ccebff' }}
                {...props}
            >
                <View style={styles.container}>
                    <View style={styles.img_container}>
                        <Image source={image} style={{ width: 200, height: 200 }} />
                    </View>
                    <View style={{ flex: 1, padding: 20, justifyContent: 'flex-end' }}>
                        <Text>{str_user}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, paddingTop: 20, borderTopLeftRadius: 40 }}>
                    <DrawerItemList {...props} />
                    {props.user === null ?
                        <DrawerItem label="דף משתמש" onPress={() => Alert.alert("משתמש לא מחובר")} />
                        :
                        null
                    }
                </View>

            </DrawerContentScrollView>
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
    },
    img_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 80
    }
});

export default CustomDrawer;
