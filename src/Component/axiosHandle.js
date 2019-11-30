import axios from "axios";
import { message } from "antd";
import browserHistory from "./history";
import store from "./../Store";

let axiosIns = axios.create({
    headers:{'x-requested-with': 'XMLHttpRequest'},
});

axiosIns.defaults.headers.post['Content-Type'] = "application/json;charset=UTF-8";

axiosIns.interceptors.response.use( response => {
    let data = response.data;
    return data;
}, error => {
    if(!error.response){
        message.error("请求错误,请联系管理员处理！")
        return Promise.reject(error);
    }
    let statusCode = error.response.status;
    if (statusCode === 401) {
        message.warning("认证已经失效，需要重新登录！")
        localStorage.clear();
        store.dispatch({
            type: "logout",
        })
        browserHistory.push("/login/");
        return Promise.reject(error);
    }
    if (statusCode === 403) {
        message.warning("用户名或密码错误！")
        return Promise.reject(error)
    }
    // message.error("请求错误,请联系管理员处理！")
    return error.response.data;
})

export const request = () => {
    
    return axiosIns
}