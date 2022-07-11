import * as React from 'react';
import { IconButton, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import camra_rotate from '../assets/camera-rotate-solid.svg'

const CameraButton = ({ navigation }) => (
    <IconButton
        icon="camera"
        color={Colors.red500}
        size={200}
        onPress={() => navigation.navigate('מצלמה')}
    />

);

export default CameraButton;
