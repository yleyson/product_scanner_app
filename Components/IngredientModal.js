import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome';
import DescIngModal from './DescIngModal';


const IngredientModal = ({ ingredients }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState("");

    return (
        <View>
            <Modal
                animationType="slide"
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
                                <FlatList
                                    data={ingredients}
                                    keyExtractor={(item) => item.name}
                                    renderItem={({ item }) => (
                                        <View style={styles.ingredientsView}>
                                            <DescIngModal btn_text={item.name} text={item.desc} />
                                        </View>

                                    )}
                                />
                                <Button style={styles.buttonClose} mode="contained" color="black" onPress={() => setModalVisible(!modalVisible)}>סגור</Button>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableOpacity>
            </Modal>
            <Button color='black' onPress={() => setModalVisible(true)} >מרכיבים</Button>

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
        alignItems: 'center',
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

export default IngredientModal;