import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import ProductCard from '../Components/ProductCard'
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../Context/UserContext';

const apiFavorites = 'http://proj10.ruppin-tech.co.il/api/Favorites/'

const apiIngs = 'http://proj10.ruppin-tech.co.il/api/GetIngredientsInfo/'



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
        for (const product of productList) {
            await GetIngs(product.id_prod)
        }
        setShowCards(true)
    }





    useEffect(async () => {
        if (productList === null)
            await GetAllFavorites()
    }, [])

    const GetAllFavorites = async () => {

        fetch(apiFavorites + user.id, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                if (res.ok) {
                    return res.json()
                }
                else
                    return null;

            })
            .then(
                (result) => {
                    setProductList(result)
                    console.log("GetAllFavorites = ", result);
                },
                (error) => {
                    console.log("err GET=", error);
                });
    };


    const GetIngs = async (product_id) => {

        await fetch(apiIngs + product_id, {
            method: 'GET',
            // body: JSON.stringify(UserById),
            headers: new Headers({
                //   'Content-Type': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);

                if (res.ok) {
                    return res.json()
                }
                else
                    return null;

            })
            .then(
                (result) => {
                    debugger
                    console.log(product_id)
                    console.log("GetIngs", result)
                    let dictTemp = productDict
                    console.log(dictTemp)
                    let value = createDictValues(result)
                    console.log("value = ", value);
                    dictTemp[product_id] = value
                    console.log("dict[] = ", dictTemp);
                    setProductDict(dictTemp)

                },
                (error) => {
                    console.log("err GET=", error);
                });

    }

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