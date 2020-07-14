const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require("node-fetch");
//const fs = require("fs");

//const secret = JSON.parse(fs.readFileSync("secret.json"));

const recaptcha_site_secret = "6LcObaQZAAAAAD8ITKOo3UaF2-J13qrUhMcwIRaF";

admin.initializeApp({
    credential: admin.credential.cert(
        {
            "type": "service_account",
            "project_id": "maow-link",
            "private_key_id": "480dd012613c1a873f513fd245ad2c22bade3264",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrupaC8mzLXfhc\nKunkGaiz1BouuGJkTdqjEuwP6OcWNgXvny/Q3kYozXqdkHOH+DIdhhcBW6Thb842\nH7NIjVE2j7zvzyvcl5QfCpqS5vrN3mITeivyIdX4NqxAUZu9CdWj9hVoblwfebdO\nmjRgVdH8vY0uyFnsXlQx8r/g5qUqs9ZeTlwsIBcRnSzxm+zvErvITAL2KiPIg+Us\n81q9ULXw6fFQq8G4jnRDEQwg570QpX/r61qSUSfH9ZJP4zdYfn/Q0bJD/YguBsbW\nvW37O0UZ31Rb59vdGeSIjd3QDPClIrGt6l0FTtrikZk0hkOtMOuQYW697fdFAdCi\nksFFrl61AgMBAAECggEAArz962acL333GNkiU53JH9zw8e/Eud637sO9ed9319XS\nsGh0Zbs1mS71lo+YGAHwIqJhuYbRkTqsKhbFUBHYyqruE1DVXTYZiYksv8zpEOFL\n5Q2cp8a8V7Hfe0MR3ajLfErPOpQP6fyR3LH+xc54g7QuDSHqtScn5of9YUOsPIsM\n0HIBFhyzWyb3WY/X7CjRQnWs/lSWx6pLcbjRW00qwbDxrxN8vkuonScqGoSxNZoG\nzr4as8RWfFtUNTSw4/DyPoGi1As3tB4dU7KzMV2AOaMu4nZAT+i7RUBoYg1ugK7h\nEy3CHFjcavJhepC2Fyq3Eju3ODTzgjWF73khMgYLAQKBgQDvGUJG+1ay4Fjg/G8q\n1i5SbdVGN1WSQP+kwYOD6sqmi9wpg3bC8MLGRVCDvsWtKQ9LKe53vNA/4bVw9yEq\nNRexSrvlvj11Cg5GyQ1LAhG8N5TK4+pFdhL/eTNyVYiNm8h21rjCBUGx3yRpOxka\nFTjQ+hY439sTwoBHUJGM/Mj89QKBgQC33jOjfkBVxmDV/q56EtTgGVDmY80xMQWS\ne4qFtMDXFcFBjLyC4DHbW6HZDuQmXtUQjs82KEuvI8ju/uBnn+Oy+b5CrepFxLg1\nIv6OQcAM5GVbQVPf2yKIdpEjln1kO7lW/6fbpeg59ryzS3JkLDowZxDLkRwFxGWS\n4BMrLt7CwQKBgCu5kc5LTnqd3oMehvHtg0Edxt/1ZJe/fUDTBssMGA1HDHcnDIPv\n5Z6+tE+zhpD5LkvPmkWZaPgVvcmv2AfQ98k7YotMNA8ATMYTJHQwJ7Ak9ff4oDId\nurGvp4HkNHm5IHrjH5yTu4TcytrXrOqBMQe+hGvYPEcrzau9BzEiVVs1AoGAe2wU\njbK5zNoVNpB23kq1ypgzzfNAUbzuWJ3FJmtm5vobd7zY7aFA1lZ0FhgA3iDaNPsn\n7Nqvsyj6QDOmvuh9GC68oFXN5Hdgj4qmBSftmrnVr6PygVm/nIq6coEaOqY8i0Gh\nk7eSYxZVJKWIa+WkScllZMBLZzOmWyk+tMYJkgECgYEA1IOH9D3/qxJwLdo6rpN4\n0TO28+ICtk63/tHGXE8+tkoxjmB55k3zI20p93Rp3RgWcNU+E9mWDroQZ9SJ+S4a\nJiodhecdgKK27k022S4M1cK8a2kFv6fhNtQEYX9wWFpKwuP2xWBjfJVaAizHRjsS\nV8U7ZZYE6KcJWXuBUzCWAUM=\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-el1xr@maow-link.iam.gserviceaccount.com",
            "client_id": "111772089519464343057",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-el1xr%40maow-link.iam.gserviceaccount.com"
        }
    ),
    databaseURL: "https://maow-link.firebaseio.com"
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.generate = functions.https.onRequest((request, response) => {
    const data = request.body;
    response.set('Access-Control-Allow-Origin', '*');
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    const recaptcha_data = {
        secret: recaptcha_site_secret,
        response: data.token
    }
    let recaptcha_url = new URL("https://www.google.com/recaptcha/api/siteverify");
    recaptcha_url.search = new URLSearchParams(recaptcha_data);
    fetch(recaptcha_url)
        .then(
            res => res.json()
        )
        .then(
            res => {
                if (res.success === true) {
                    const db = admin.database();
                    db.ref("router/" + data.hash).set(data.target);
                }
            }
        )
        .then(
            res => {
                response.send(200, {
                    status: true,
                    result: ("https://maow-link.web.app/?n="+data.hash)
                });
            })
        .catch(error => {
            response.send(200, {
                status: false,
                result:err
            });
        });
});





