import { createContext, useEffect, useState } from 'react';


export const UserContext = createContext();

const apiUrl = 'http://proj10.ruppin-tech.co.il/api/Users?pass=';

export default function UserContextProvider({ children }) {

    const [user, SetUser] = useState(null)




    const LoginIn = (email, password) => {
        const UserMail = email
        const UserPass = password
        fetch(apiUrl + UserPass + "&user_mail=" + UserMail, {
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
                    console.log("result", result);
                    console.log("result-id", result.id);
                    SetUser(result)

                },
                (error) => {

                    console.log(apiUrl + email);
                    console.log("err GET=", error);
                });
    }


    return (
        <UserContext.Provider value={{ user, SetUser, LoginIn }}>
            {children}
        </UserContext.Provider>
    )


}
