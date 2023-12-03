import { state } from "../../state";
import { Router } from "@vaadin/router";

class Home extends HTMLElement{
    connectedCallback(){
        this.render(); 
    }


    completarForm(){
        const form = document.querySelector(".form-home");
        form?.addEventListener("submit", (e)=>{
            e.preventDefault();
            const target = e.target as any;
            const email = target.email.value;
            const name = target.name.value; 
            state.setNameEmail(name,email);
            this.verificarUsuer(email)
            
        })
    }
    verificarUsuer (email:string){  
        const error = document.querySelector(".error");
        state.logearse(email)
        .then(() => {
            const lastState = state.getState();
            if (lastState.idUser) {
                Router.go("/rooms");
            } else {
              error?.classList.add("error--aparecer");
            }
          })
          .catch((err) => {
            console.error('Error al verificar el usuario:', err);
          });     
    }


    listenerCrearCuenta(){
      const btnLink = document.querySelector(".crear--cuenta");
      btnLink?.addEventListener("click", ()=>{
        Router.go("/creteUser");
      })
    }

    render(){
            const style = document.createElement("style");
            style.innerHTML = `
            .container__gral{
              width: 100vw;
              height: 100vh;
              background-color: var(--White);
            }
            .login--linea{
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
            .container__login{
              width:85%;
              margin: 80px auto;
              background-color: var(--veryPaleBlue);
              padding:20px;
              position: relative;
              border-radius: 10px;
            }
            .login__title{
              font-size:40px;
              font-family: 'Roboto', sans-serif;
              margin:0px;
              margin-bottom:20px;
              text-align: center;
            }
           .form-home{
            display:flex;
            flex-direction: column;
            flex-wrap: wrap;
           }
           .login__input{
            display: block;
            width: 100%;
            height: 55px;
            margin-bottom: 15px;
            font-size: 23px;
            border: none;
            border-bottom: 2px solid var(--darkGrayishBlue);
            font-family: 'Roboto', sans-serif;
           }
           .login__input:placeholder{
            font-size: 23px
            color:var(--darkGrayishBlue);
          }
          .login__input:focus{
            outline:none;
            border-bottom: 2px solid var(--veryDarkBlue);
          }
          .login__input:hover{
            background-color:var( --lightGrayish);
          }
          .login__btn{
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
          .login__btn:active{
            transform: scale(0.95);
            border-bottom: none;
          }
          .login__btn:hover{
            transform: scale(1.01);
          }
          .crear--cuenta{
            font-family: 'Roboto', sans-serif;
            display: inline-block;
            margin-top: 20px;
            cursor: pointer;
          }
          .crear--cuenta:hover{
            color:var(--brightRed);
          }
          .error{
            display: none;
            position: absolute;
          }
          .error--aparecer{
            color: var(--brightRed);
            display: inherit; 
          }
          @media (min-width: 768px) {
            .container__login{
                width:50%;
            }
          @media (min-width: 1024px) {
            .container__login{
            width:30%;
          }
            `

            this.innerHTML = `
            <section class="container__gral">
              <div class="container__login">
                <span class="login--linea"></span>
                <h1 class="login__title">Bienvenida/o</h1>
                <form class="form-home">

                  <label for="name">
                  <input id="name" name="name" type="text" class="login__input" placeholder="Nombre"></label>

                  <label for="email">
                  <span class="error">email incorrecto</span>
                  <input id="email" name="email" type="email" class="login__input"  placeholder="email"></label>
                  <button class="login__btn">Ingresar</button>

                </form>
                <p class="crear--cuenta">Crear cuenta</p>
              </div>
            </section>
            `
            this.completarForm();
            this.listenerCrearCuenta();
            this.appendChild(style);
            
    }
}

customElements.define("home-page", Home)