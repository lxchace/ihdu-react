import React, { Component } from 'react';
import './login.css'
import { request } from "./axiosHandle";
import { Form, Input, Button } from 'antd';
import { Link } from "react-router-dom";
import store from "./../Store";

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            usernameInput: {
                status: "success",
                help: ""
            },
            passwordInput: {
                status: "success",
                help: ""
            }
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(e){
        if(e.target.value === ""){
            this.setState({
                username: e.target.value,
                usernameInput: {
                    status: "error",
                    help: "请输入用户名~"
                }
            })
        }else{
            this.setState({
                username: e.target.value,
                usernameInput: {
                    status: "success",
                    help: ""
                }
            })
        }
    }

    handlePasswordChange(e){
        if(e.target.value === ""){
            this.setState({
                password: e.target.value,
                passwordInput: {
                    status: "error",
                    help: "请输入密码~"
                }
            })
        }else{
            this.setState({
                password: e.target.value,
                passwordInput: {
                    status: "success",
                    help: ""
                }
            })
        }
    }

    login(){
        let url = "/api/login/";
        let data = {
            username: this.state.username,
            password: this.state.password,
        }
        return request().post(url, data);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.login().then(
            res => {
                localStorage.setItem('username', res.data.username);
                store.dispatch({
                    type: "login",
                })
                this.props.history.goBack();
            });
    }

    render(){
        return (
            <div className="login-box">
            <Form className="login-form" onSubmit={this.handleSubmit}>
                <Form.Item>
                <h1>Welcome</h1>
                </Form.Item>
                <Form.Item validateStatus={this.state.usernameInput.status} help={this.state.usernameInput.help}>
                    <Input className="txtb" name={this.state.username} onChange={this.handleUsernameChange} placeholder="Username" />
                </Form.Item>
                <Form.Item validateStatus={this.state.passwordInput.status} help={this.state.passwordInput.help}>
                    <Input className="txtb" type="password" name={this.state.password} onChange={this.handlePasswordChange} placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button className="login-btn" htmlType="submit">登录</Button>
                </Form.Item>
                <Form.Item>
                    <div className="register-btn">没有账号？点击<Link to="/register/">注册!</Link></div>
                </Form.Item>
            </Form>
            </div>
        )
    }
}

export default Login;