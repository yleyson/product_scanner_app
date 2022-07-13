

const google_api = async (imgBase64) => {
    console.log("dfgdfgfdgdf")

    const text_result = await fetch('https://google-text-api.herokuapp.com/api/google_text', {
        method: 'POST',
        body: JSON.stringify({ text: imgBase64 }),
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
                return result
            },
            (error) => {

                console.log("err GET=", error);
                return "שגיאה"
            });

    return text_result

};



const getIngExplansion = async (ing_list) => {
    const ing_explansion = await fetch('https://ingredients-data-api.herokuapp.com/get_ingredients', {
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
                return result
            },
            (error) => {

                console.log("err GET=", error);
                return { result: "שגיאה" }
            });

    return ing_explansion;
}

const apiFavorites = 'http://proj10.ruppin-tech.co.il/api/Favorites/'

const apiIngs = 'http://proj10.ruppin-tech.co.il/api/GetIngredientsInfo/'




const GetAllFavorites = async (user_id) => {

    const favorites_list = await fetch(apiFavorites + user_id, {
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
                console.log("GetAllFavorites = ", result);
                return result
            },
            (error) => {
                console.log("err GET=", error);
            });

    return favorites_list
};


const GetIngsFromFavorites = async (product_id) => {

    const ing_arr = await fetch(apiIngs + product_id, {
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
                console.log("GetIngs", result)
                return result

            },
            (error) => {
                console.log("err GET=", error);
            });

    return ing_arr

}


export { google_api, getIngExplansion, GetAllFavorites, GetIngsFromFavorites };