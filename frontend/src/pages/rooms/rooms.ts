import { state } from "../../state";
import {Router} from '@vaadin/router';

class Rooms extends HTMLElement{
    connectedCallback(){
        this.render();   
        this.selectEventListener()
    }

    selectEventListener(){
        const select = document.querySelector('#roomSelect')  as HTMLSelectElement;
        const roomInput = document.querySelector('#room')  as HTMLSelectElement;
        const roomLabel = document.querySelector(".room-label") as HTMLSelectElement;

        select?.addEventListener('change', () => {
            if(select.value == "existRoom"){
                roomLabel.classList.add("input__display-flex");
                roomLabel.classList.remove("input__diplay-none");
            }else{
                roomLabel.classList.add("input__diplay-none");
                roomLabel.classList.remove("input__display-flex");
            }
            
        });
    }
    
    ingresarListener(){
        const form = document.querySelector(".form-room"); 

        const select = document.querySelector('#roomSelect')  as HTMLSelectElement;
        form?.addEventListener("submit", (e)=>{
            e.preventDefault();
            const target = e.target as any;
            //Ingresar a room existente
            if(select.value == "existRoom"){
                console.log('estoy en ingresar a room')
                const nroRoom = target.room.value; 
                state.ingresarRoom(nroRoom)
                .then(()=>{
                    Router.go("/chat");
                })
            }else{ //Crear una nueva room
                console.log('estoy en la creación');
                
                state.crearRoom()
                .then(()=>{//Lo hago con promesa para que solo se rediriga a la nueva página una vez que tenga ya guardado el numero de chat guardado en el state
                    Router.go("/chat");
                })
            }
            
        })
    }

    render(){
        const roomsList = state.getState().rooms;
            const style = document.createElement('style');
            
            style.innerHTML = `
            .container__room{
                width:85%;
                margin: 80px auto;
                background-color: var(--veryPaleBlue);
                padding:20px;
                position: relative;
                border-radius: 10px;
            }
            .rooms--linea{
                content: "";
                position: absolute;
                width: 100%;
                height: 5px;
                display: inline-block;
                top: 0px;
                left: 0px;
                border-radius: 10px 10px 00px 0px;
                background-image: var(--darkToggle);
            }
            .subtitle--bien{
                font-size:40px;
                font-family: 'Roboto', sans-serif;
                margin:0px;
                margin-bottom:20px;
            }
            .input-user{
                display: block;
                width: 100%;
                height: 55px;
                margin-bottom: 15px;
                font-size: 23px;
                border-radius: 5px;
                border: 2px solid var(--darkGrayishBlue);
            }
            .input-user:hover{
                background: var(--lightGrayish);
                
            }
            .input-user:focus{
                border: 2px solid var(--veryDarkBlue)
            }
            .input__diplay-none{
                display:none;
            }
            .input__display-flex{
                display:inherit;
            }
            .btn-in{
                background: var(--limeGreen);
                width: 100%;
                height: 55px;
                font-size: 23px;
                border:none;
                border-radius: 5px;
                border-bottom: 3px solid  var( --darkGrayishBlue);
                border-left: 2px solid var( --darkGrayishBlue);
                margin-top:30px;
                cursor:pointer;
                font-family: 'Roboto', sans-serif;
                transition: transform 0.2s border-bottom 0.1s;
            }
            .btn-in:active{
                transform: scale(0.95);
                border-bottom: none;
            }
            .btn-in:hover{
                transform: scale(1.01);
            }
            .room-subt{
                font-size:25px;
                font-family: 'Roboto', sans-serif;
                margin:0px;
                margin:15px 0px;
            }
            .rooms-p{
                font-family: 'Roboto', sans-serif;
                margin: 0px 15px;
            }
            .container-p{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
            }
            `
            
            this.innerHTML = `
            <div class="container__room">
                <span class="rooms--linea"></span>
                    <h2 class="subtitle--bien">Bienvenide ${state.getState().from}</h2>
                <form class="form-room">
            
                    <select id="roomSelect" class="input-user">
                        <option value="newRoom">Nuevo room</option>
                        <option value="existRoom">Room existente</option>
                    </select>
            
                    <label class="room-label input__diplay-none" for="room">
                        <span class="form__span">Nuero de sala</span>
                        <input id="room" name="room" type="text" class="input-user">
                    </label>

                    <button class="btn-in">Ingresar</button>
                </form>
                <div class="container--rooms">
                    <h2 class="room-subt">Rooms</h2>
                    <div class="container-p">${roomsList.map((e)=>{
                        return `<p class="rooms-p">${e}</p>`  
                    }).join("")}</div>
                </div>
            </div>
            `
            this.appendChild(style);
            this.ingresarListener();
    }
}

customElements.define("rooms-page", Rooms)