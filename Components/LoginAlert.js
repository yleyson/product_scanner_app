import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';

const LoginAlert = ({ navigation }) => {
    const [visible, setVisible] = React.useState(true);

    useEffect(() => {
        if (!visible) {
            navigation.navigate('דף בית')
            setVisible(true)

        }
    }, [visible])


    const hideDialog = () => {
        setVisible(false)
    }

    return (
        <Provider>
            <View>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>This is simple dialog</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
    );
};

export default LoginAlert;