import React, { Component } from 'react';
import './information.css'
import { request } from "./axiosHandle";
import { message, Form, Input, PageHeader, Divider, Button, Row, Col, Tooltip, Icon, Modal } from 'antd';

class Information extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: 1,
            username: "",
            nickname: "",
            email: "",
            validateEmail: false,
            phone: "",
            validatePhone: false,
            lastLogin: "",
            newPassword: "",
            password: "",
            emailInput: {
                status: "success",
                help: ""
            },
            phoneInput: {
                status: "success",
                help: ""
            },
            passwordInput: {
                status: "warning",
                help: ""
            },
            emailBtn: "验证邮箱",
            phoneBtn: "验证手机",
            modalType: "email",
            visible: false
        }
    }

    getInformation(){
        let url = "/api/user/information/";
        return request().get(url);
    }

    modifyInformation(){
        let url = "/api/user/modify/";
        let data = {
            nickname: this.state.nickname,
            email: this.state.email,
            phone: this.state.phone,
            password: this.state.password,
            newPassword: this.state.newPassword
        }
        return request().post(url, data)
    }

    componentDidMount = async () => {
        let res = await this.getInformation();
        if(res.code === 200){
            let data = res.data;
            this.setState({
                id: data.id,
                username: data.username,
                nickname: data.nickname,
                email: data.email,
                validateEmail: data.validateEmail,
                emailBtn: data.validateEmail ? "已验证":"验证邮箱",
                phone: data.phone,
                validatePhone: data.validatePhone,
                phoneBtn: data.validatePhone ? "已验证":"验证手机",
                lastLogin: data.lastLogin
            })
        }else{
            message.error("获取个人信息失败，请检查网络！")
        }
    }

    handleNickNameChange = (e) => {
        this.setState({
            nickname: e.target.value,
        })
    }

    handleEmailChange = (e) => {
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

    handlePhoneChange = (e) => {
        const reg = /^1([0-9]*)?$/
        if((reg.test(e.target.value) && e.target.value.length < 12) || e.target.value === ''){
            this.setState({
                phone: e.target.value,
                phoneInput: {
                    status: "success",
                    help: ""
                }
            })
        }else{
            this.setState({
                phoneInput: {
                    status: "error",
                    help: "请输入正确的手机号码~"
                }
            })
        }
    }

    handleNewPasswordChange = (e) => {
        this.setState({
            newPassword: e.target.value
        })
    }

    handlePasswordChange = (e) => {
        if(e.target.value === ""){
            this.setState({
                password: "",
                passwordInput: {
                    status: "error",
                    help: "请输入旧密码~"
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

    handleSubmit = async (e) => {
        e.preventDefault();
        let res = await this.modifyInformation();
        console.log(res);
        if(res.code === 200){
            message.success("修改个人信息成功~");
            let data = res.data;
            this.setState({
                id: data.id,
                username: data.username,
                nickname: data.nickname,
                email: data.email,
                validateEmail: data.validateEmail,
                emailBtn: data.validateEmail ? "已验证":"验证邮箱",
                phone: data.phone,
                validatePhone: data.validatePhone,
                phoneBtn: data.validatePhone ? "已验证":"验证手机",
                lastLogin: data.lastLogin,
                password: "",
                newPassword: ""
            })
        }else{
            message.error("修改个人信息失败~");
            message.error(res.msg);
        }
    }

    sendEmail(){
        let url = "/api/user/sendmail/";
        return request().get(url)
    }

    valiEmail(code){
        let url = "/api/user/validatemail/";
        let data = {
            code: code
        }
        return request().post(url, data)
    }

    handleEmailClick = async () => {
        let res = await this.sendEmail();
        if(res.code === 200){
            message.success("验证邮件已发送！");
            this.setState({
                visible: true,
                modalType: "email"
            })
        }else{
            message.error("验证邮件发送失败，请重试~")
        }
    }

    handlePhoneClick = () => {
        message.info("手机验证功能还在开发中~");
        this.setState({
            visible: true,
            modalType: "phone"
        })
    }

    handleModalCancel = () => {
        Modal.confirm({
            title: "提示",
            content: "您确认取消此次验证吗？若您取消了本次验证，下次点击 验证 按钮会有新的验证码发到您的设备！",
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.setState({
                    visible: false
                })
                const { form } = this.formRef.props;
                form.resetFields();
            },
        });
    }

    handleModalOk = () => {
        const { form } = this.formRef.props;
        form.validateFields(async (err, values) => {
            if(err){
                message.error("验证失败，请重试！");
                return
            }
            if(values.type === "email"){
                let res1 = await this.valiEmail(values.code);
                if(res1.code === 200){
                    message.success("验证成功！");
                    this.setState({
                        visible: false,
                        validateEmail: true,
                        emailBtn: "已验证"
                    })
                }else{
                    message.error("验证失败！");
                    message.error(res1.msg);
                }
            }else if(values.type === "phone"){
                let res2 = await this.valiEmail(values.code);
                if(res2.code === 200){
                    message.success("验证成功！");
                    this.setState({
                        visible: false,
                        validatePhone: true,
                        phoneBtn: "已验证"
                    })
                }else{
                    message.error("验证失败！");
                    message.error(res2.msg);
                }
            }
            form.resetFields();
            return
        })
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render(){
        return (
            <div className="information-page">
                <PageHeader onBack={() => this.props.history.goBack()} title="我的信息" />
                <Form onSubmit={this.handleSubmit} className="information-table" labelCol={{md:{span:6, offset:3}}} wrapperCol={{md:{span:9, offset:0}}}>
                    <Form.Item label="ID">
                        <Input disabled={true} value={this.state.id} />
                    </Form.Item>
                    <Form.Item label="用户名">
                        <Input disabled={true} value={this.state.username} />
                    </Form.Item>
                    <Form.Item label="昵称">
                        <Input value={this.state.nickname} allowClear={true} onChange={this.handleNickNameChange} />
                    </Form.Item>
                    <Form.Item label={
                            <span>
                                邮箱&nbsp;
                                <Tooltip title="若您修改了邮箱，请先提交修改信息再验证，否则邮件会发送到您以前的邮箱！">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                        validateStatus={this.state.emailInput.status} help={this.state.emailInput.help}>
                        <Row gutter={4}>
                            <Col span={18}>
                                <Input value={this.state.email} type="email" allowClear={true} onChange={this.handleEmailChange} />
                            </Col>
                            <Col span={6}>
                                <Button disabled={this.state.validateEmail} onClick={this.handleEmailClick}>{this.state.emailBtn}</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label={
                            <span>
                                手机&nbsp;
                                <Tooltip title="若您修改了手机，请先提交修改信息再验证，否则短信会发送到您以前的号码！">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                        validateStatus={this.state.phoneInput.status} help={this.state.phoneInput.help}>
                        <Row gutter={4}>
                            <Col span={18}>
                                <Input value={this.state.phone} type="tel" allowClear={true} onChange={this.handlePhoneChange} />
                            </Col>
                            <Col span={6}>
                                <Button disabled={this.state.validatePhone} onClick={this.handlePhoneClick}>{this.state.phoneBtn}</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="最后登录时间">
                        <Input disabled={true} value={this.state.lastLogin} />
                    </Form.Item>
                    <Divider></Divider>
                    <Form.Item label="新密码">
                        <Input value={this.state.newPassword} type="password" placeholder="若不修改密码，此处不填~" allowClear={true} onChange={this.handleNewPasswordChange} />
                    </Form.Item>
                    <Form.Item label="旧密码" validateStatus={this.state.passwordInput.status} help={this.state.passwordInput.help} hasFeedback>
                        <Input value={this.state.password} type="password" placeholder="若要修改信息，请输入密码~" onChange={this.handlePasswordChange} />
                    </Form.Item>
                    <Form.Item className="information-btn" wrapperCol={{md:{offset:9}}}>
                        <Button type="primary" htmlType="submit">修改信息</Button>
                    </Form.Item>
                </Form>
                <ModalForm 
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    type={this.state.modalType}
                    handleOk={this.handleModalOk}
                    handleCancel={this.handleModalCancel}
                />
            </div>
        )
    }
}

class ModalFormWithoutCreate extends Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="请输入验证码"
                visible={this.props.visible}
                onOk={this.props.handleOk}
                onCancel={this.props.handleCancel}
                okText="提交"
                cancelText="取消"
                width="250px"
                closable={false}
                maskClosable={false}
            >
                <Form>
                    <Form.Item>
                        {getFieldDecorator("type", {initialValue: this.props.type})(<></>)}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator("code",
                            {
                                rules: [{required: true, message: "请输入验证码"}]
                            }
                        )(
                            <Input
                                prefix={<Icon type="number" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="验证码"
                                style={{ width:"200px" }}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

const ModalForm = Form.create()(ModalFormWithoutCreate);

export default Information;