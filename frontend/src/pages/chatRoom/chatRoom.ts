import { state } from "../../state";
import {Router} from '@vaadin/router';
type Message = {
    from: string,
    message:string
}
class ChatRooms extends HTMLElement{
    connectedCallback(){ 
        state.leerMessages();
        state.subscribe(()=>{  
            //state.leerMessages()
            const lastState = state.getState();
            this.messages = lastState.messages; 
            this.render();
            this.scrollToBottom()
        });

        this.render();
        this.scrollToBottom()
    }
    messages:Message[] =[];
   scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    //Escucha el click en el boton o enter para mandar el msj
    addListener(){
        const form = this.querySelector('.form--chat'); 
        const messageInput = form?.querySelector('.input-messagge') as HTMLInputElement;
        form?.addEventListener("submit", (e)=>{
            e.preventDefault();
            const target = e.target as any;
            const mensaje = target.message.value; 
            state.pushMessages(mensaje);
        })
        messageInput?.addEventListener("keyup", (e)=>{
            e.preventDefault();
            if(e.key == "Enter"){
                const mensaje = messageInput.value;
                state.pushMessages(mensaje);
                messageInput.value;
            }
        })
    };
    render(){
        const lastState = state.getState();
        const style = document.createElement("style"); 

        style.innerHTML = `
        .container--general{
            height: 100vh;
            width: 100vw;
            font-family: 'Roboto', sans-serif;
            font-sieze: 30px;
        }
        .header{
            width: 100%;
            height: 15%;
            padding: 20px;
            background: var(--darkToggle);
            
        }
        .header__numeroChat{
            text-align: center;
            margin: 0px;
            font-size: 35px;
        }
        .chat--container{
            width: 90%;
            height: 70%;
            background: var(--veryPaleBlue);
            margin: 0px auto 5px auto;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
        }
        
    /* Oculta las barras de desplazamiento */
        .chat--container::-webkit-scrollbar {
            display: none;
        }
        .chat{
            height: 100%;
            display: flex;
            flex-direction: column;     
        }
        .form--chat{
            height: 15%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column-reverse;
            background: var(--darkToggle);
        }
        .input-messagge{
            width: 95%;
            height: 60%;
            border: none;
            border-bottom: 3px solid var(--darkGrayishBlue);
            font-family: 'Roboto', sans-serif;
            position: relative;
            font-size: 23px;
            padding: 2px 40px 0px 2px;
        }
        .btn{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background-color: green;
            cursor: pointer;
            position: absolute;
            right: 5%;
        }
        .mensaje{
            width: 40%;
            margin: 10px;
        }
        .mensaje-my{
            position: relative;
            left: 50%;
        }
        .chat--mensaje{
            border-radius: 20px;
            padding: 15px;
            text-align: center;
        }
        .mensaje__nombre{
            font-size:15px;
            margin: 0px 0px 2px 15px;
            color: #424949;
        }
        .chat--mensaje-otro{
            background-color: var(--brightRed);
            text-align: center;
        }
        .chat--mensaje-my{
            background-color:var(--limeGreen);
            }
        }
        `

         this.innerHTML = `
         <div class="container--general">
            <header class="header">
                    <p class="header__numeroChat">Sala de chat número ${lastState.idRoom}</p>
            </header>
                
            <div id="chat-messages" class="chat--container">
                <div class="chat">
                    ${this.messages.map(e => { 
                        if (state.getState().from == e.from) { 
                            return `<div class="mensaje mensaje-my"><span class="mensaje__nombre">${e.from}</span><div class="chat--mensaje chat--mensaje-my">${e.message}</div></div>`
                        } else {
                            
                            return `<div class="mensaje"><span class="mensaje__nombre">${e.from}</span><div class="chat--mensaje chat--mensaje-otro">${e.message}</div></div>`
                        }
                    }).join("")}
                   
                </div>
            </div>
                
            <form class="form--chat">
                    <textarea  type="text" name="message" class="input-messagge"></textarea>
                    <button class="btn">></button>
                </form>
        </div>

        ` 
           
            this.addListener();
            this.appendChild(style);
            
            
    }
}

customElements.define("chatroom-page", ChatRooms)