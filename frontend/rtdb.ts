import firebase from "firebase";

//Esto  es para conectarse a la base de datos
const app = firebase.initializeApp({
    apiKey:'kRPFc20QJPgqH5V2sGuRywXTsSavsSXMuaT3MRCx', //Lo saco de la tuerquieta, cuentas servicio, y secretos de la base de datos
    databaseURL:'https://chat-dos-ddb83-default-rtdb.firebaseio.com/',
    authDomain: 'chat-dos-ddb83.firebaseapp.com'
})

const database = firebase.database(); 

export {database};