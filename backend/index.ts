import { fs, rtdb } from "./db";
import * as express from "express";
import * as cors from 'cors';
import { v4 as uuidv4 } from "uuid";
import * as path from 'path';

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json()); //Esto me permitirá leer el body. En el chat anterior me descargué body-parser para poder hacerlo.

const usersCollection = fs.collection("users");
const roomsCollection = fs.collection("rooms");

//ENDPOINT PARA CREAR USUARIO 
app.post("/signup", (req, res)=>{
    const email = req.body.email; 
    const name = req.body.nombre;
    usersCollection.where("email", "==", email) //Busco en todos los documentos el campo que sea email y chequea si es igual al email que pasaron en el body
    .get() //El get le  indica que comience la busqueda
    .then((resBusqueda)=>{ //La promesa con la respuesta
        if(resBusqueda.empty){ //Si la respuesta es que no hay ningun mail que sea igual al mail que me pasaron significa que puedo crar el usuario
            usersCollection.add({
                email,
                name,
                rooms:[] =[]
            }).then((nuevaRefCreada)=>{
                res.json({
                    id: nuevaRefCreada.id
                })
            })
        }else{
            res.status(400).json({
                message: "user exist"
            })
        }
    })
    .then(()=>{
        res.json({
            id: usersCollection.doc().id
        })
    })
})

//ENDPOINT PARA INGRESAR 
//Si el usuario existe debolverá el id con el que está guardado el la database
app.post("/login", (req, res)=>{
    const email = req.body.email;
    usersCollection.where("email", "==", email)
    .get()
    .then((resBusquedaEmail)=>{
        const roomsArray = resBusquedaEmail.docs[0].data().rooms
        if(resBusquedaEmail.empty){
            res.status(404).json({
                message: "no existe usuario"
            })
        }else{
            res.json({
                id: resBusquedaEmail.docs[0].id,
                rooms: roomsArray
            })    
        }
    })
})


//ENDPOINT PARA CREAR UN ROOM EN LA RIAL TIMEDATABASE
app.post("/rooms", (req,res)=>{
    const userId = req.body.id; //Este id lo mando en el body para chequear que el usuario exista
    const roomId = 1000 + Math.floor(Math.random()*999); //Est es el id corto que le pasaré al usuario y que también puede compartir para que entren a su chat

    usersCollection.doc(userId.toString()) //Llamo al documento que tenga el id del usuario
    .get()
    .then((doc)=>{
        if(doc.exists){
          const roomRef =  rtdb.ref(`/rooms/${uuidv4()}`)
          roomRef.set({
            messages: [] = [],
            owner: userId
          })
          .then(()=>{
            const roomLongId = roomRef.key;
            roomsCollection.doc(roomId.toString()).set({ //Creo un docuemento que tendrá el id corto, y en el interior guardará el id largo
                rtdbRoomId: roomLongId,
            }).then(()=>{
                res.json({
                    id: roomId.toString(), //Devuelvo el id amigable
                    idRtdb: roomLongId.toString()
                })
            })
          })
          //Agrego en el documento users el id corto para poder recuperarlo luego
          const userRooms = doc.data().rooms || []; 
            userRooms.push(roomId.toString());
            return usersCollection.doc(userId.toString()).update({
                rooms: userRooms
              })
        }else{
            res.status(401).json({
                message: "No existe el usuario"
            })
        }
    })
})

//PARA INGRESAR A UNA ROOM ESPECIFICA CUANDO SE TIENE EL NUMERO DE ROOM
app.get("/rooms/:roomId", (req,res)=>{
    const userId = req.query.userId; //Es el mismo userId que sacaba en los post con el body, pero en el endpoint get no se usa el body, así que una query. 
    const roomId = req.params.roomId; // los params paso el id facil que el usuario puede saber 
    
    usersCollection.doc(userId.toString()) 
    .get()
    .then((doc)=>{
        if(doc.exists){
            roomsCollection.doc(roomId)
            .get()
            .then((snap)=>{ //Le saco una captura al documento con que tiene le id que le pasé 
                const data = snap.data();
             
                
                res.json(data); //Respondo con lo que tiene en el interior, que sería el id largo
            })
        }else{
            res.status(401).json({
                message: "usuario no existe"
            })
        }
    })
})
//Recibir mensajes 
app.post("/messages", function (req, res) {
    const from = req.body.from;
    const message = req.body.message; 
    const idRtdb = req.body.rtdbId
    const chatRoomRef = rtdb.ref(`/rooms/${idRtdb}/messages`);
 
    
    chatRoomRef.push({from, message}, function(){
        res.json('todo ok');
    })
    
})

//Desde acá se lee el front
app.use(express.static("dist"));
app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname,"../dist/index.html"))
})

app.listen(port, ()=>{
    console.log(`En el puerto ${port}`);
});
