import React, { Component } from 'react';
import './register.css'
import { request } from "./axiosHandle";
import { Form, Input, Button, message } from 'antd';

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            repassword: "",
            email: "",
            usernameInput: {
                status: "success",
                help: ""
            },
            passwordInput: {
                status: "success",
                help: ""
            },
            repasswordInput: {
                status: "success",
                help: ""
            },
            emailInput: {
                status: "success",
                help: ""
            }
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRePasswordChange = this.handleRePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(e){
        const nameRule = "^[A-Za-z0-9]{5,50}$";
        const namePat = new RegExp(nameRule)
        if(e.target.value === ""){
            this.setState({
                username: e.target.value,
                usernameInput: {
                    status: "error",
                    help: "请输入用户名~"
                }
            })
        }else if(!namePat.test(e.target.value)){
            this.setState({
                username: e.target.value,
                usernameInput: {
                    status: "error",
                    help: "允许数字，大小写字母且长度大于5~"
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

    handleRePasswordChange(e){
        if(e.target.value === ""){
            this.setState({
                repassword: e.target.value,
                repasswordInput: {
                    status: "error",
                    help: "请输入密码~"
                }
            })
        }else if(e.target.value !== this.state.password){
            this.setState({
                repassword: e.target.value,
                repasswordInput: {
                    status: "error",
                    help: "两次输入的密码不一样，请检查~"
                }
            })
        }else{
            this.setState({
                repassword: e.target.value,
                repasswordInput: {
                    status: "success",
                    help: ""
                }
            })
        }
    }

    handleEmailChange(e){
        const emailRule = "^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$";
        const emailPat = new RegExp(emailRule)
        if(e.target.value === ""){
            this.setState({
                email: e.target.value,
                emailInput: {
                    status: "error",
                    help: "请输入邮箱~"
                }
            })
        }else if(!emailPat.test(e.target.value)){
            this.setState({
                email: e.target.value,
                emailInput: {
                    status: "error",
                    help: "请输入正确的邮箱~"
                }
            })
        }else{
            this.setState({
                email: e.target.value,
                emailInput: {
                    status: "success",
                    help: ""
                }
            })
        }
    }

    register(){
        let url = "/api/user/register/";
        let data = {
            username: this.state.username,
            password: this.state.password,
            repassword: this.state.repassword,
            email: this.state.email,
        }
        return request().post(url, data);
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        let res = await this.register();
        if(res.code === 200){
            this.props.history.push("/login/");
        }else{
            message.warn(res.msg);
        }
        return
    }

    render(){
        return (
            <div className="login-box">
            <Form className="login-form" onSubmit={this.handleSubmit}>
                <Form.Item>
                <h1>Welcome</h1>
                </Form.Item>
                <Form.Item validateStatus={this.state.usernameInput.status} help={this.state.usernameInput.help}>
                    <Input className="txtb" name={this.state.username} onChange={this.handleUsernameChange} placeholder="请输入需要注册的用户名" />
                </Form.Item>
                <Form.Item validateStatus={this.state.passwordInput.status} help={this.state.passwordInput.help}>
                    <Input className="txtb" type="password" name={this.state.password} onChange={this.handlePasswordChange} placeholder="请输入密码" />
                </Form.Item>
                <Form.Item validateStatus={this.state.repasswordInput.status} help={this.state.repasswordInput.help}>
                    <Input className="txtb" type="password" name={this.state.repassword} onChange={this.handleRePasswordChange} placeholder="请再次输入密码" />
                </Form.Item>
                <Form.Item validateStatus={this.state.emailInput.status} help={this.state.emailInput.help}>
                    <Input className="txtb" name={this.state.email} onChange={this.handleEmailChange} placeholder="请输入您的邮箱地址" />
                </Form.Item>
                <Form.Item>
                    <Button className="login-btn" htmlType="submit">注册</Button>
                </Form.Item>
            </Form>
            </div>
        )
    }
}

export default Register;