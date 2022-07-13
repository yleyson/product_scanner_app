import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import ProductCard from '../Components/ProductCard'
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../Context/UserContext';
import { GetAllFavorites, GetIngsFromFavorites } from '../Fetchs'


export default function UserPage2() {


    const [showCards, setShowCards] = useState(false)
    const [productList, setProductList] = useState(null)
    const [productDict, setProductDict] = useState({})
    const { user } = useContext(UserContext);


    useEffect(async () => {
        if (productList != null) {
            console.log("dffffffffffffffffffffffffffffffffffffffffffffffffffff")
            await getAllIngData()
        }
    }, [productList])


    const getAllIngData = async () => {
        console.log("productList", productList)
        let ing_list = []
        let value = {}
        let dictTemp = productDict

        for (const product of productList) {
            dictTemp = productDict
            ing_list = await GetIngsFromFavorites(product.id_prod)
            value = createDictValues(ing_list)
            dictTemp[product.id_prod] = value
            setProductDict(dictTemp)
        }
        setShowCards(true)
    }





    useEffect(async () => {
        if (productList === null) {
            let product_list = await GetAllFavorites(user.id)
            setProductList(product_list)
        }
    }, [])


    const createDictValues = (result) => {
        let value = { name: result[0].product_name, ing_list: [] }

        result.map((ing) => {
            value.ing_list.push({ name: ing.Ing_Name, desc: ing.descript })
        })

        return value
    }

    const deleteProduct = (id) => {
        setProducts((prevProduct) => {
            return prevProduct.filter(product => product.id != id)
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}><Icon size={30} name="star" /> 2 מועדפים</Text>
            {
                showCards ?
                    <FlatList
                        data={productList}
                        keyExtractor={(item) => item.id_prod}
                        renderItem={({ item }) => (
                            <ProductCard item={productDict[item.id_prod]} />
                        )}
                    />
                    :
                    null
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 5

    },
    title: {
        fontSize: 25,
        marginTop: 10,
        marginBottom: 5
    }
});