import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import image_deafult from '../assets/image.jpg'
import { useIsFocused } from '@react-navigation/native';
import callGoogleVisionAsync from '../helperFunctions';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import camra_rotate from '../assets/camera-rotate-solid.svg'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import HTMLParser from 'fast-html-parser'
import AddIngModal from '../Components/AddIngModal';


let str = "רכיבים: קמח חיטה מלא (3.8%) (מכיל גלוטן), ממתיקים,"
str += "\n"
str += "קקי, (איזומלט, מלטיטול, סוכרלוז), קמח שיבולת שועל מלא"
str += "\n"
str += ",עמילן תירס, סובין חיטה, קמח תירס,(מכיל גלוטן)"
str += "\n"
str += "סיבי עולש, מלח, חומר תפיחה (סודיום ביקרבונט), חומר"
str += "\n"
str += "מונע התגיישות (מגנזיום קרבונט), אבקת קקאו, מעכב"
str += "\n"
str += "חמצון (תערובת טוקופרולים),קקה."

let ing_to_put = {}
let ing_list_ocr = []
let current_ing = ""
let ing_to_replace = ""

export default function CameraPage({ navigation }) {

    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const isFocused = useIsFocused();
    const [text, setText] = useState("");

    const [textArr, setTextArr] = useState(null);
    const [textArrTEmp, setTextArrTemp] = useState(null);

    const [textDict, setTextDict] = useState(null);


    //camera
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }



    const takePicture = async () => {
        setText("")
        if (camera) {
            const data = await camera.takePictureAsync({ base64: true })
            setImage(data.uri)
            setImageData(data)
        }
    }


    //ocr
    const pickImage = async () => {


        setText("Loading.."); //set value of text Hook




        //const responseData = await callGoogleVisionAsync(imageData.base64);

        let responseData = ""
        await fetch('https://google-text-api.herokuapp.com/api/google_text', {
            method: 'POST',
            body: JSON.stringify({ text: imageData.base64 }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
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
                    console.log("result", result);
                    responseData = result
                },
                (error) => {

                    console.log("err GET=", error);
                });

        console.log(responseData)

        ing_list_ocr = GetIngredientsFromText(responseData)
        getIngExplansion(ing_list_ocr)


    };

    const GetIngredientsFromText = (text) => {
        console.log('test')
        //  console.log(text)


        let ing_index_start = text.indexOf("רכיבים")
        ing_index_start += 7

        let ing_index_end;



        for (let i = ing_index_start; i < text.length; i++) {
            if (text[i] == '.' && isNaN(text[i - 1])) {
                ing_index_end = i;
                console.log("dotttttt" + text[i])
                break;
            }
        }

        text = text.substring(ing_index_start, ing_index_end)
        text = text.trim()
        text = text.replace(/\n/g, " "); //replace newlines/line breaks with spaces 
        text = text.replace(/ *\([^)]*\) */g, "") //Remove text between parentheses
        text = text.replace(',,', ',')
        let arr = text.split(',').map(element => element.trim()); //Split String and Trim 

        console.log(arr)

        return arr

    }

    /*
    const addCheckIngSign = async (ing) => {

        await getIngExplansion(ing, true)
    }
*/
    const getIngExplansion = async (ing_list, replace = false, add = false) => {
        console.log(add)
        fetch('https://ingredients-data-api.herokuapp.com/get_ingredients', {
            method: 'POST',
            body: JSON.stringify(ing_list),
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
                    console.log("result", result);
                    !replace ? (
                        setText(""),
                        setTextDict(result),
                        setTextArr(Object.keys(result))
                    )
                        :
                        !add ?
                            (
                                ing_to_put = result[ing_list[0]],
                                setText(ing_to_put.description)
                            )
                            :
                            (
                                console.log("dsfsdfsdfsdfsdfsdfsdfsdfsdfsdf"),
                                addIngredient(result[ing_list[0]])
                            )


                },
                (error) => {

                    console.log("err GET=", error);
                });
    }


    const getIngToReplaceDesc = (ing) => {

        getIngExplansion([ing], true)
    }

    const addIngredient = (ing) => {
        let tempDict = textDict
        tempDict[ing.ingredient] = ing
        setTextDict(tempDict)
        setTextArr(Object.keys(tempDict))
    }


    const replaceIng = () => {

        let tempDict = textDict
        tempDict[ing_to_put.ingredient] = ing_to_put
        delete tempDict[current_ing];
        setTextDict(tempDict)
        setTextArr(Object.keys(tempDict))
        console.log(Object.keys(tempDict))

    }

    const deleteIngredient = () => {
        let tempDict = textDict
        delete tempDict[current_ing];
        setTextDict(tempDict)
        setTextArr(Object.keys(tempDict))
        textArrTEmp != null ? setTextArrTemp(null) : setText("")
    }



    return (
        <View style={{ flex: 1 }}>
            <View style={styles.camera_container}
            >
                {image === null && textArr === null ?
                    isFocused && <Camera
                        ref={ref => setCamera(ref)}
                        style={styles.fixed_ratio}
                        type={type}
                    >
                        <View style={{ alignSelf: 'baseline' }}>
                            <Ionicons.Button size={30} name="camera-reverse" backgroundColor="black" color="white" onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }} />
                        </View>



                    </Camera>
                    : textArr === null ?
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>{text}</Text>
                            <Image source={{ uri: image }} style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'contain',
                            }} />
                        </View>

                        :
                        <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
                            {
                                text != "" ?
                                    <View style={{ flex: 1 }}>
                                        <ScrollView style={{ height: '60%', marginBottom: 40 }}>
                                            <Text style={{ fontSize: 20 }}>{text}</Text>
                                        </ScrollView>


                                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            {textArrTEmp != null ? <Button mode="contained" color="black"
                                                onPress={() => { replaceIng(); setTextArrTemp(null) }}>
                                                החלף רכיב</Button> : <Button mode="contained" color="red" onPress={() => deleteIngredient()}
                                                    style={{ marginBottom: 30 }}>מחק רכיב</Button>
                                            }
                                            <Button style={{ marginTop: 20 }} mode="contained" color="black"
                                                onPress={() => { setText("") }}>סגור</Button>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {textArrTEmp != null ?
                                            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>האם התכוונת ל...</Text> : null}
                                        <FlatList
                                            keyExtractor={(item) => item}
                                            data={textArrTEmp != null ? textArrTEmp : textArr}
                                            renderItem={({ item }) => (
                                                <View style={{
                                                    flex: 1, flexDirection: 'row', justifyContent: 'center', padding: 5,
                                                    alignItems: 'center',
                                                    borderBottomColor: 'black',
                                                    borderBottomWidth: 1,
                                                }}>
                                                    <Button color="black" onPress={() => {
                                                        textArrTEmp === null && textDict[`${item}`].found ?
                                                            (
                                                                current_ing = item,
                                                                setText(textDict[`${item}`].description)

                                                            )
                                                            :
                                                            textArrTEmp != null ?
                                                                getIngToReplaceDesc(item)
                                                                :
                                                                (
                                                                    current_ing = item,
                                                                    setTextArrTemp(textDict[`${item}`].maybe)
                                                                )
                                                    }}
                                                        style={{ fontSize: 20, textAlign: 'center' }}>
                                                        {item}
                                                    </Button>
                                                    {textArrTEmp === null && textDict[`${item}`].found === false ?
                                                        <MaterialIcons size={20} name="cancel" color="red" /> : null}
                                                </View>

                                            )}
                                        />
                                        {textArrTEmp !== null ? <View >
                                            <Button mode="contained" color="red" onPress={() => deleteIngredient()}
                                                style={{ marginBottom: 30 }}>מחק רכיב</Button>
                                            <Button mode="contained" color="black"
                                                onPress={() => { setTextArrTemp(null) }}>חזור לשאר הרכיבים</Button>
                                        </View> : null}
                                    </View>

                            }

                        </View>
                }

            </View>

            <View style={styles.button_container}>

                <Button color='black' mode="contained"
                    onPress={() => { setImage(null), setTextArr(null), setTextDict({}) }} >מצלמה</Button>
                <Button color='black' mode="contained" onPress={() => takePicture()} >צלם מוצר</Button>
                <Button color='black' mode="contained" onPress={() => pickImage()} >קבל רכיבים</Button>
            </View>
            <View style={styles.button_container}>
                <Button color='blue' mode="contained">שמור מוצר</Button>
                <AddIngModal addIng={(ing) => getIngExplansion([ing], true, true)} />
            </View>
        </View >

    )
}



const styles = StyleSheet.create({

    camera_container: {
        flex: 1,
        marginBottom: 10
    },
    fixed_ratio: {
        flex: 1,
    },
    button_container: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    }
})







