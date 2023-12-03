import {Router} from '@vaadin/router';


const router = new Router(document.querySelector(".root"));
router.setRoutes([
  {path: '/', component: 'home-page'},
  {path: '/creteUser', component: 'createuser-page'},
  {path: '/rooms', component: 'rooms-page'},
  {path: '/chat', component: 'chatroom-page'}
 
]);