import { state } from "../../state";
import { Router } from "@vaadin/router";

class Createuser extends HTMLElement{
    connectedCallback(){
        this.render(); 
    }

    completarRegistro(){
      const formRegistro = document.querySelector(".form__create-user");
      formRegistro?.addEventListener("submit", (e)=>{
        e.preventDefault();
        const target = e.target as any;
        const email = target.email.value;
        const name = target.name.value;
        state.setNameEmail(name,email); 
        this.veriUsuer(email,name)
      })
    }
    veriUsuer (email:string, name:string){  
      const error = document.querySelector(".error__email");
      state.createUser(email, name)
      .then(() => {
          const lastState = state.getState();
          if (lastState.idUser) {
            
            Router.go("/");
          } else {
          
            error?.classList.add("error__email--aparecer");
          }
        })   
  }
  listenerIniicarSec(){
    const btnLink = document.querySelector(".iniciar--secion");
    btnLink?.addEventListener("click", ()=>{
      Router.go("/");
    })
  }
    render(){
            const style = document.createElement("style");
            style.innerHTML = `
            .container__general--createUser{
              width: 100vw;
              height: 100vh;
              background-color: var(--White)
            }
            .container__createUser{
              width:85%;
              margin: 80px auto;
              background-color: var(--veryPaleBlue);
              padding:20px;
              position: relative;
              border-radius: 10px;
            }
            .createUser--linea{
              content: "";
              position: absolute;
              width: 100%;
              height: 5px;
              display: inline-block;
              top: 0px;
              left: 0px;
              border-radius: 10px 10px 00px 0px;
              background-image: var(--detalles);
            }
            .createUser__subtitle{
              font-size:40px;
              font-family: 'Roboto', sans-serif;
              margin:0px;
              margin-bottom:20px;
              text-align: center;
            }
            .error__email{
              display: none;
              position: absolute;
            }
            .error__email--aparecer{
              color: var(--brightRed);
              display: inherit; 
            }
            .input-user{
              display: block;
              width: 100%;
              height: 55px;
              margin-bottom: 15px;
              font-size: 23px;
              border: none;
              border-bottom: 2px solid var(--darkGrayishBlue);
              font-family: 'Roboto', sans-serif;
            }
            .input-user::placeholder{
              font-size: 23px
              color:var(--darkGrayishBlue);
            }
            .input-user:focus{
              outline:none;
              border-bottom: 2px solid var(--veryDarkBlue);
            }
            .input-user:hover{
              background-color:var( --lightGrayish);
            }
            .btn-create{
              background: var(--brightRed);
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
            .iniciar--secion{
              font-family: 'Roboto', sans-serif;
              display: inline-block;
              margin-top: 30px;
              cursor: pointer;
            }
            .iniciar--secion:hover{
              color:var(--brightRed);
            }
            .btn-create:active{
              transform: scale(0.95);
              border-bottom: none;
            }
            .btn-create:hover{
              transform: scale(1.01);
            }
            @media (min-width: 768px) {
              .container__createUser{
                width:50%;
              }
            @media (min-width: 1024px) {
              .container__createUser{
                width:30%;
              }
            }
            `

            this.innerHTML = `
            <section class="container__general--createUser">
            <div class="container__createUser">
            <span class="createUser--linea"></span>
                <h2 class="createUser__subtitle">Crear usuaria/o</h2>

                <form class="form__create-user">
                    <label>
                        <span class="error__email">email existente</span>
                        <input type="email" name="email" class="input-user" placeholder="email" required>
                    </label>
                    <label>
                        <input type="text" name="name" class="input-user" placeholder="nombre" required>
                    </label>
                    <button class="btn-create">Crear usuarix</button>
                </form>
                <p class="iniciar--secion">Iniciar seción</p>
            </div>
        </section>
            `
            this.completarRegistro();
            this.listenerIniicarSec(),
            this.appendChild(style);
    }
}

customElements.define("createuser-page", Createuser )