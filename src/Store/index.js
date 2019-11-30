import { createStore } from "redux";
import reducers from "./reducers";

const severState = {
    loginState:localStorage.getItem('username') ? true:false,
}

const store = createStore(reducers, severState);

store.subscribe(function(){
    console.log("收到更新",store.getState());
})

export default store;