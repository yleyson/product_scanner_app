import { View, Text, Alert } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { Drawer } from 'react-native-paper';

import HomePage from '../Pages/HomePage'
import CameraPage from '../Pages/CameraPage'
import UserPage from '../Pages/UserPage'
import LoginModal from '../Components/LoginModal'
import { UserContext } from '../Context/UserContext';
import LoginAlert from '../Components/LoginAlert'
import CustomDrawer from '../Components/CustomDrawer';
const DrawerNav = createDrawerNavigator();


export default function NavigationComp() {
    const { user, SetUser } = useContext(UserContext);




    const LogOut = () => {
        return user == null ? <LoginModal /> : <Button onPress={() => { SetUser(null) }}>התנתק</Button>
    }



    return (
        <NavigationContainer>
            <DrawerNav.Navigator initialRouteName="דף בית"
                drawerContent={props => <CustomDrawer user={user} {...props} />}>
                <DrawerNav.Screen name="דף בית" component={HomePage}
                    options={{
                        headerRight: () => (
                            LogOut()
                        ),

                    }} />
                <DrawerNav.Screen name="מצלמה" component={CameraPage}
                    options={{
                        headerRight: () => (
                            LogOut()
                        ),
                    }} />
                {
                    user != null ?
                        <DrawerNav.Screen name="דף משתמש" component={UserPage}
                            options={{
                                headerRight: () => (
                                    LogOut()
                                )
                            }} />
                        :
                        null
                }



            </DrawerNav.Navigator>
        </NavigationContainer>
    )
}