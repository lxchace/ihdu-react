import React, { Component } from 'react';

import './account.css';
import { request } from './axiosHandle';
import { Table, PageHeader, message, Button, Modal, Form, Input, Icon } from 'antd';
const ButtonGroup = Button.Group;


class AccountPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            account: [],
            addModal: {
                visible: false,
            },
            modifyModal: {
                visible: false,
                record: {}
            }
        }
    }

    getAccount(){
        let url = "/api/hdu/detail/";
        return request().get(url)
    }

    addAccount(data){
        let url = "/api/hdu/add/";
        return request().post(url, data)
    }

    delAccount(id){
        let url = "/api/hdu/"+ id +"/delete/"
        return request().get(url)
    }

    modifyAccount(id, data){
        let url = "/api/hdu/"+id+"/modify/";
        return request().post(url, data)
    }

    addIndexToData(data){
        let newData = []
        for (let i = 0; i < data.length; i++) {
            let each = data[i];
            each.index = i+1;
            newData.push(each);
        }
        return newData;
    }

    componentDidMount = async () => {
        let res = await this.getAccount();
        if(res.code === 200){
            let data = this.addIndexToData(res.data);
            this.setState({
                account: data,
            })
        }else{
            message.error("获取账户信息失败，请刷新页面重试~");
        }
    }

    showAddModal = () => {
        const oldSetting = this.state.addModal;
        this.setState({
            addModal: Object.assign({}, oldSetting, {visible: true}),
        })
    }

    handleAddCancel = () => {
        const oldSetting = this.state.addModal;
        this.setState({
            addModal: Object.assign({}, oldSetting, {visible: false}),
        })
    }

    handleAddOk = () => {
        const { form } = this.addFormRef.props;
        form.validateFields(async (err, values) => {
            if(err){
                message.error("添加账户失败，请重试！");
                return
            }
            let res = await this.addAccount(values);
            if(res.code === 200){
                message.success("添加账户成功~")
                let res = await this.getAccount();
                if(res.code === 200){
                    let data = this.addIndexToData(res.data);
                    this.setState({
                        account: data,
                        addModal: Object.assign({}, this.state.addModal, {visible: false}),
                    })
                }else{
                    message.error("获取账户信息失败，请刷新页面重试~");
                }
                form.resetFields();
            }else{
                message.error(res.msg);
            }
        });
    }

    showModifyModal = (record) => {
        const oldSetting = this.state.modifyModal;
        this.setState({
            modifyModal: Object.assign({}, oldSetting, {visible: true, record: record}),
        })
    }

    handleModifyCancel = () => {
        const oldSetting = this.state.modifyModal;
        this.setState({
            modifyModal: Object.assign({}, oldSetting, {visible: false}),
        })
    }

    handleModifyOk = () => {
        const { form } = this.modifyFormRef.props;
        form.validateFields(async (err, values) => {
            if(err){
                message.error("修改账户失败，请重试！");
                return
            }
            let res = await this.modifyAccount(values.id, values);
            if(res.code === 200){
                message.success("修改账户成功~")
                let res = await this.getAccount();
                if(res.code === 200){
                    let data = this.addIndexToData(res.data);
                    this.setState({
                        account: data,
                        modifyModal: Object.assign({}, this.state.modifyModal, {visible: false}),
                    })
                }else{
                    message.error("获取账户信息失败，请刷新页面重试~");
                }
                form.resetFields();
            }else{
                message.error(res.msg);
            }
        });
    }

    handleConfirmOk = async (id) => {
        let res = await this.delAccount(id);
        if(res.code === 200){
            message.success("删除账号成功！");
            let res2 = await this.getAccount();
            if(res2.code === 200){
                let data = this.addIndexToData(res2.data);
                this.setState({
                    account: data,
                })
            }else{
                message.error("获取账户信息失败，请刷新页面重试~");
            }
        }else{
            message.error("删除账号失败，请稍后重试~");
        }
    }

    confirm(record) {
        Modal.confirm({
            title: "提示",
            content: "您确认删除该账号（学号：" + record.xh + "）吗？",
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.handleConfirmOk(record.id),
        });
    }

    saveAddFormRef = formRef => {
        this.addFormRef = formRef;
    };

    saveModifyFormRef = formRef => {
        this.modifyFormRef = formRef;
    };

    render(){
        const columns = [
            {
                title: 'ID',
                dataIndex: 'index',
                key: 'index',
                align: "center",
            },{
                title: '学号',
                dataIndex: 'xh',
                key: 'xh',
                align: "center",
            },{
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                align: "center",
            },{
                title: '添加人',
                dataIndex: 'owner',
                key: 'owner',
                align: "center",
                render: (owner) => (owner.username),
            },{
                title: '最后登录时间',
                dataIndex: 'lastLogin',
                key: 'lastLogin',
                align: "center",
            },{
                title: '操作',
                dataIndex: '',
                key: 'x',
                align: "center",
                render: (text, record) => (
                        <ButtonGroup>
                            <Button type="danger" onClick={() => this.confirm(record)}>删除</Button>
                            <Button type="primary" onClick={() => this.showModifyModal(record)}>修改</Button>
                        </ButtonGroup>
                    ),
            },
        ]
        return (
            <div className="account-page">
                <PageHeader
                    onBack={() => this.props.history.goBack()}
                    title="我的账号"
                    extra={[<Button type="primary" key="1" icon="plus-circle" onClick={this.showAddModal}>添加账号</Button>]}
                />
                <Table
                    columns={columns} 
                    rowKey={record => record.id}
                    dataSource={this.state.account} 
                    scroll={{ x: true }} 
                    pagination={false} 
                />
                <ModalForm
                    title="添加账号"
                    visible={this.state.addModal.visible}
                    handleCancel={this.handleAddCancel}
                    handleOk={this.handleAddOk}
                    form={<AddForm wrappedComponentRef={this.saveAddFormRef} xhDisabled={false} />}
                />
                <ModalForm
                    title="修改账号"
                    visible={this.state.modifyModal.visible}
                    handleCancel={this.handleModifyCancel}
                    handleOk={this.handleModifyOk}
                    form={<AddForm wrappedComponentRef={this.saveModifyFormRef} xhDisabled={true} record={this.state.modifyModal.record} />}
                />
            </div>
        )
    }
}

class ModalForm extends Component{

    render(){
        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                onOk={this.props.handleOk}
                onCancel={this.props.handleCancel}
                confirmLoading={this.props.confirmLoading}
                okText="提交"
                cancelText="取消"
                width="250px"
            >
                {this.props.form}
            </Modal>
        )
    }
}

class AddFormWithoutCreate extends Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator("id", {initialValue: this.props.record ? this.props.record.id:""})(<></>)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("xh",
                        {
                            initialValue: this.props.record ? this.props.record.xh:"",
                            rules: [{type: 'number', required: true, message: "请输入学号", transform:(value)=> {return Number(value)}}]
                        }
                    )(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="学号"
                            style={{ width:"200px" }}
                            disabled={this.props.xhDisabled}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("pwd",
                        {
                            rules: [{required: true, message: "请输入密码"}]
                        }
                    )(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                            style={{ width:"200px" }}
                        />
                    )}
                </Form.Item>
            </Form>
        )
    }
}
const AddForm = Form.create({ name: "addForm "})(AddFormWithoutCreate);

export default AccountPage;