import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationComp from './Routs/NavigationComp';
import UserContextProvider from './Context/UserContext';



export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="gray" barStyle="light-content" />
      <UserContextProvider>
        <NavigationComp />
      </UserContextProvider>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
});


/*
<NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="דף בית" component={HomePage}
            options={{
              headerRight: () => (
                <LoginModal />
              ),
            }} />
          <Drawer.Screen name="מצלמה" component={CameraPage}
            options={{
              headerRight: () => (
                <LoginModal />
              ),
            }} />
          <Drawer.Screen name="דף משתמש" component={UserPage}
            options={{
              headerRight: () => (
                <LoginModal />
              ),
            }} />
          <Drawer.Screen name="test" component={ImagePickerComponent}
            options={{
              headerRight: () => (
                <LoginModal />
              ),
            }} />
        </Drawer.Navigator>
      </NavigationContainer>
*/