import { log } from "console";
import { database } from "../rtdb";
const API_BASE_DATOS =  process.env.API || "http://localhost:3000";


import { Router } from "@vaadin/router";
const state = {
    data: {
      from:"",
      email:"",
      status:Number, //El status, que peude ser 400, 200, etc
      idUser: "", //Verfica si el usuario esxiste o no 
      idRoom:"",
      rtdbId:"", //Id largo de rtdb
      rooms:[] = [], //Todos los rooms que tiene el usuario
      messages:[] = []
    },
    listeners: [], // los callbacks
   
    getState() {
      return this.data;
    },
    setState(newState) {
       this.data = newState; 
       for(const cb of this.listeners){
        cb();
       }
    },
    subscribe(callback: (any) => any) {
       this.listeners.push(callback);
    },
    setNameEmail(name:string, email:string){
        const lastState = this.getState(); 
        lastState.from = name; 
        lastState.email = email
        this.setState(lastState); 
    },
    //El usuario se logue y se chequea si existe o no. 
    logearse(email:string):Promise<void> {
      const lastState = this.getState();
      return fetch(`${API_BASE_DATOS}/login`, {
        method: "post",
        headers:{
            "content-type": "application/json",
        },
        body: JSON.stringify({
            email: email,
        })
      })
      .then((res)=>{
        lastState.status = res.status
        return res.json()
      })
      .then((data)=>{
      
        
        if(data.id){
          lastState.idUser = data.id
          lastState.rooms = data.rooms
        }
        this.setState(lastState);
      })
      .catch((err)=>{
        throw err; 
      })
    },
//Crar un usuario nuevo
    createUser(email:string, nombre:string){
      const lastState = this.getState();
     return fetch(`${API_BASE_DATOS}/signup`, {
        method: "post",
        headers:{
            "content-type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            nombre: nombre
        })
      })
      .then((res)=>{
        lastState.status = res.status
        return res.json()
      })
      .then((data)=>{
       
        
        if(data.id){
          lastState.idUser = data.id
        }
        this.setState(lastState);
      })

      .catch((err)=>{
        throw err; 
      })
    },
//Crear una room nueva. 
    crearRoom(){
      const lastState = this.getState();
      return fetch(`${API_BASE_DATOS}/rooms`, {
        method: "post",
        headers:{
            "content-type": "application/json",
        },
        body: JSON.stringify({
            id: lastState.idUser,
        })
      })
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{
        lastState.idRoom = data.id; 
        lastState.rtdbId = data.idRtdb;
        
        this.setState(lastState);  
      })
      .catch((err)=>{
        throw err; 
      })
    },
//INGRESAR A LA ROOM QUE YA EXISTE
    ingresarRoom(nroRoom){
      const lastState = this.getState();
      const userId = lastState.idUser
      
      return fetch(`${API_BASE_DATOS}/rooms/${nroRoom}?userId=${userId}`, {
        method: "get",
        headers:{
            "content-type": "application/json",
        },
      })
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{ 
       lastState.rtdbId = data.rtdbRoomId
       lastState.idRoom =  nroRoom
       this.setState(lastState);  
      })
      .catch((err)=>{
        throw err; 
      })
    },
//QUEDARS ESCUCHANDO LA RTDB
    leerMessages(){
      const lastState = this.getState();
      const rtdbId = lastState.rtdbId;
      const chatRoomRef = database.ref(`/rooms/${rtdbId}`);
    
      chatRoomRef.on("value" , (snap)=>{
          const msjFromBdd = snap.val();
         

          const listMessages:any= [];
          const objMsjs =  msjFromBdd.messages;
         
          
       //recorro el objeto que cotiene los objetos que tinen el nombre y msjs en la base de datos rtdb
       //lastState.messages = [];
        for (const key in objMsjs) {
          if (objMsjs.hasOwnProperty(key)) {
        //El objeto de mensaje que tiene el nombre de quien mando el msj y el texto del mensaje, lo guardo en data.messages
          const conversacion = objMsjs[key];
          listMessages.push(conversacion); 
          }
        }
        lastState.messages = listMessages; 
        this.setState(lastState); 
      })
    },
    //Leer los mensajes y guardarlos
    pushMessages(message:string){
      const lastState = this.getState();
      const nombreState = this.data.from;
     
      const rtdbId = lastState.rtdbId;

      fetch(API_BASE_DATOS + `/messages`, {
          method: "post",
          headers:{
              "content-type": "application/json",
          },
          body: JSON.stringify({
              from: nombreState,
              message:message,
              rtdbId: rtdbId
          })
      })
  }

  };
  export{state};