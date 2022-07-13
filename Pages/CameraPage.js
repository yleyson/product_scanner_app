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
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import HTMLParser from 'fast-html-parser'
import AddIngModal from '../Components/AddIngModal';
import { google_api, getIngExplansion } from '../Fetchs'
import SaveProductModal from '../Components/SaveProductModal';

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
let current_ing = ""

export default function CameraPage({ navigation }) {

    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const isFocused = useIsFocused();
    const [text, setText] = useState("");
    const [screen, setScreen] = useState("camera");

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

    useEffect(() => {
        if (image !== null)
            setScreen("image")
    }, [image])





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
    const getData = async () => {


        setText("Loading.."); //set value of text Hook
        console.log("img")

        const text_from_img = await google_api(imageData.base64)
        console.log(text_from_img)

        if (text_from_img === "שגיאה") {
            setText("שגיאה")
            return
        }

        let ing_list_ocr = await GetIngredientsFromText(text_from_img)
        if (ing_list_ocr === null) {
            setText("לא נמצאו רכיבים")
            return
        }

        const ing_exp = await getIngExplansion(ing_list_ocr)

        if (ing_exp === "שגיאה") {
            setText("שגיאה")
            return
        }

        console.log("sdfdsfsdfsdf" + ing_exp)

        setText("")
        setTextDict(ing_exp)
        setTextArr(Object.keys(ing_exp))
        setScreen("ingredients")
    };

    const GetIngredientsFromText = (text) => {
        console.log('test')
        //  console.log(text)


        let ing_index_start = text.indexOf("רכיבים")
        if (ing_index_start === -1) {
            return null
        }
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



    const getIngToReplaceDesc = async (ing) => {
        ing_to_put = await getIngExplansion([ing])
        ing_to_put = ing_to_put[ing]
        setText(ing_to_put.description)
    }

    const addIngredient = async (ing) => {
        let ing_to_add = await getIngExplansion([ing])
        ing_to_add = ing_to_add[ing]
        let tempDict = textDict
        tempDict[ing] = ing_to_add
        console.log(tempDict)
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

    const saveProduct = (prod_name, prod_category = "") => {

        let check_if_not_found = false
        textArr.map((ing_name) => {
            if (!textDict[ing_name].found) {
                check_if_not_found = true
                return
            }
        })
        if (check_if_not_found) {
            Alert.alert("קיים רכיב ללא הסבר מחק או החלף רכיב")
            return
        }


        let ing_list = []
        textArr.map((ing_name) => {
            let ing = { name: ing_name, desc: textDict[ing_name].description }
            ing_list = [...ing_list, ing]
        })

        let product = {
            name: prod_name,
            category: prod_category,
            ingerdients: ing_list
        }

        console.log(product)
    }



    return (
        <View style={{ flex: 1 }}>
            <View style={styles.camera_container}
            >
                {screen === "camera" ?
                    isFocused && <Camera
                        ref={ref => setCamera(ref)}
                        style={styles.fixed_ratio}
                        type={type}
                    >
                        <View style={{ alignSelf: 'baseline' }}>
                            <MaterialIcons.Button size={30} name="flip-camera-ios" iconStyle={{ marginRight: 0 }} backgroundColor="black"
                                color="white" onPress={() => {
                                    setType(
                                        type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back
                                    );
                                }} />
                        </View>
                    </Camera>
                    : screen === "image" ?
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>{text}</Text>
                            <Image source={{ uri: image }} style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'contain',
                            }} />
                        </View>

                        :
                        <View style={{ padding: 20, flex: 1, marginBottom: 2 }}>
                            {
                                text != "" ?
                                    <View>
                                        <ScrollView style={{ marginBottom: 10 }}>
                                            <Text style={{ fontSize: 20 }}>{text}</Text>
                                        </ScrollView>


                                        <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                            {textArrTEmp != null ? <Button mode="contained" color="black"
                                                onPress={() => { replaceIng(); setTextArrTemp(null) }}>
                                                החלף רכיב</Button> : <Button mode="contained" color="red" onPress={() => deleteIngredient()}
                                                    style={{ marginBottom: 20 }}>מחק רכיב</Button>
                                            }
                                            <Button style={{ marginTop: 10 }} mode="contained" color="black"
                                                onPress={() => { setText("") }}>סגור</Button>
                                        </View>

                                    </View>
                                    :
                                    <View style={{
                                        backgroundColor: 'white', borderColor: 'black', borderWidth: 1, alignSelf: 'center',
                                        padding: 10, borderRadius: 20, minWidth: 250
                                    }}>
                                        {textArrTEmp != null ?
                                            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>האם התכוונת ל...</Text> : null}
                                        <FlatList
                                            keyExtractor={(item) => item}
                                            data={textArrTEmp != null ? textArrTEmp : textArr}
                                            renderItem={({ item }) => (
                                                <View style={{
                                                    flex: 1, flexDirection: 'row', justifyContent: 'center', padding: 5,
                                                    marginBottom: 12,
                                                    alignItems: 'center',

                                                }}>
                                                    <Button color="rgba(140, 179, 217,0.4)" mode="contained" onPress={() => {
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

                                        {textArrTEmp === null ?
                                            <View style={{
                                                flexDirection: 'row', alignSelf: 'flex-start', marginTop: 5
                                            }}>

                                                <MaterialIcons size={20} name="cancel" color="red" />
                                                <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 10 }}>
                                                    רכיב לא נמצא
                                                </Text>
                                            </View>

                                            :
                                            null}





                                        {textArrTEmp !== null ? <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                            <Button mode="contained" color="red" onPress={() => deleteIngredient()}
                                                style={{ marginBottom: 30 }}>מחק רכיב</Button>
                                            <Button mode="contained" color="black"
                                                onPress={() => { setTextArrTemp(null) }}>חזור לשאר הרכיבים</Button>
                                        </View> :
                                            null
                                        }

                                    </View>

                            }


                        </View>

                }

            </View>

            <View style={{ backgroundColor: 'black', }}>
                <View style={styles.button_camera_container}>
                    <Ionicons.Button size={40} name="camera" iconStyle={{ marginRight: 0 }} backgroundColor="black" color="white"
                        onPress={() => setScreen("camera")} />

                    <MaterialIcons.Button size={40} name="motion-photos-on" iconStyle={{ marginRight: 0 }} backgroundColor="black" color="white"
                        onPress={() => {
                            if (screen === "camera")
                                takePicture()
                        }
                        } />


                    <MaterialIcons.Button size={40} name="image-search" iconStyle={{ marginRight: 0 }} backgroundColor="black" color="white"
                        onPress={() => {
                            if (screen === "image")
                                getData()
                            else if (textArr === null)
                                Alert.alert("אין רכיבים להצגה")
                            else
                                setScreen("ingredients")

                        }
                        } />



                </View>
                <View style={styles.button_container}>
                    <SaveProductModal saveProduct={(name, category) => saveProduct(name, category)} />

                    <AddIngModal addIng={(ing) => addIngredient(ing)} />
                </View>
            </View>

        </View >

    )
}



const styles = StyleSheet.create({

    camera_container: {
        flex: 1,
    },
    fixed_ratio: {
        flex: 1,
    },
    button_camera_container: {
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5
    },
    button_container: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    outerCircle: {
        borderRadius: 40,
        width: 80,
        height: 80,
        backgroundColor: 'white',
    },
    innerCircle: {
        borderRadius: 35,
        width: 70,
        height: 70,
        margin: 5,
        backgroundColor: 'black'
    },
})







