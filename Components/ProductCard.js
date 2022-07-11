import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Alert } from 'react-native-paper';
import IngredientModal from './IngredientModal';
const img = '../assets/cola.jpg'

const ProductCard = ({ item }) => (
    <Card style={styles.card_container}>
        <Card.Content style={styles.title}>
            <Title>{item.name}</Title>
        </Card.Content>
        <Card.Cover source={require('../assets/cola.jpg')} style={{ flex: 1, width: 200, height: 300 }} />
        <Card.Actions style={styles.btn_container}>
            <IngredientModal ingredients={item.ing_list} />
            <Button color='black'>מחיקה</Button>
        </Card.Actions>
    </Card>
);



const styles = StyleSheet.create({
    card_container: {
        width: 300,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5,
    },
    title: {
        flex: 1,
        alignItems: 'center',
    },
    btn_container: {
        flex: 1,
        justifyContent: 'space-between',

    },
});


export default ProductCard;