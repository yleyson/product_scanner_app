import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome';


const DescIngModal = ({ btn_text, text }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <ScrollView>
                                    <Text>{text}</Text>
                                </ScrollView>
                                <Button style={styles.buttonClose} mode="contained" color="black" onPress={() => setModalVisible(!modalVisible)}>סגור</Button>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableOpacity>
            </Modal>
            <Button mode="contained" labelStyle={{ fontSize: 15, paddingLeft: 5, paddingRight: 5 }}
                size={20} color='black' onPress={() => setModalVisible(true)} >{btn_text}
            </Button>

        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'

    },
    ingredientsView: {
        flex: 1,
        flexDirection: 'column',
        borderWidth: 0.5,
        borderColor: 'black',
        marginBottom: 10,
        padding: 5
    },
    modalView: {
        height: 500,
        width: 300,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        marginRight: 20,
    },
    buttonOpen: {
    },
    buttonClose: {
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default DescIngModal;