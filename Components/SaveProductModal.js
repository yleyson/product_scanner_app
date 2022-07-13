import React, { useState } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';


const SaveProductModal = ({ saveProduct }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
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
                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column', }}>
                                    <TextInput
                                        style={styles.input}
                                        label="שם מוצר"
                                        value={name}
                                        onChangeText={text => setName(text)}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        label="קטגוריה (לא חובה)"
                                        value={category}
                                        onChangeText={text => setCategory(text)}
                                    />
                                    <Button style={styles.buttonClose} mode="contained" color="black"
                                        onPress={() => {
                                            if (name === "") {
                                                Alert.alert("חובה לרשום שם מוצר")

                                            }
                                            else {
                                                saveProduct(name, category);
                                                setModalVisible(!modalVisible)
                                            }
                                        }}>שמור</Button>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableOpacity>
            </Modal>
            <Button color='white' mode="contained" onPress={() => setModalVisible(true)}>שמור מוצר</Button>
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
    modalView: {
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
        width: 300,
        height: 300,
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

export default SaveProductModal;