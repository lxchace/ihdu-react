import React, { Component } from 'react';
import { Menu, Layout, Dropdown, Icon, Row, Col, message } from "antd";
import './header.css'
import { request } from "./axiosHandle";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import store from "./../Store";

const { Header } = Layout;

class NavBar extends Component{

  logout = async (e) => {
    e.preventDefault();
    let res = await request().get("/api/logout/");
    if(res.code === 200){
      localStorage.clear();
      store.dispatch({
        type: "logout",
      });
      message.success("退出成功~");
      this.props.history.push("/");
    }else{
      message.error("退出登录失败，请联系管理员！")
    }
    
    return
  }

    render(){
      return (
        <Header className="head">
          <Row>
            <Col xs={{span: 21, push: 8}} sm={{span: 21, push: 8}} md={{span: 5, push: 0}} lg={{span: 5, push: 0}} xl={{span: 5, push: 0}} xxl={{span: 4, push: 0}}>
              <Logo />
            </Col>
            <Col xs={0} sm={0} md={19} lg={19} xl={19} xxl={20}>
              <MenuHDU location={this.props.location} />
              <User isLogin={this.props.loginState} logout={this.logout} />
            </Col>
            <Col xs={3} sm={3} md={0} lg={0} xl={0} xxl={0}>
              <SMeunHDU isLogin={this.props.loginState} logout={this.logout} />
            </Col>
          </Row>
        </Header>
      )
    }
  }
  
  class Logo extends Component{
    render(){
      return (
        <a href="/" className="logo">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" alt="" height="20"></img>
          <span>IHDU</span>
        </a>
      )
    }
  }
  
  class MenuHDU extends Component {

    render(){
      return (
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[this.props.location.pathname]}
          style={{ lineHeight: '64px', flex: '0 0 auto', float: 'left', fontSize: "16px"}}
        >
          <Menu.Item key="/"><Link to="/">所有课程</Link></Menu.Item>
          <Menu.Item key="/grade/"><Link to="/grade/">我的成绩</Link></Menu.Item>
          <Menu.Item key="3">我的选课</Menu.Item>
        </Menu>
      )
    }
  }
  
  class User extends Component {

    menu = (
      <Menu>
        <Menu.Item key="0">
          <Link to="/information/">我的信息</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/account/">账号管理</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
          <a onClick={this.props.logout} href="/">退出账号</a>
        </Menu.Item>
      </Menu>
    );
  
    render(){
      if(this.props.isLogin){
        return (
          <Dropdown overlay={this.menu}>
            <span className="ant-dropdown-link">
              您好，{localStorage.getItem('username')} <Icon type="down" />
            </span>
          </Dropdown>
        )
      }else{
        return (
          <Link className="ant-dropdown-link" to="/login/">
              登录
          </Link>
        )
      }
    }
  }
  
  class SMeunHDU extends Component{

    render(){
      const menu = (
        <Menu>
          <Menu.Item key="0">
            <Link to="/">
              所有课程
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/grade/">
              我的成绩
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/">
              我的选课
            </Link>
          </Menu.Item>
          <Menu.Divider />
          {this.props.isLogin ? (
            <Menu.Item key="3">
              <Link to="/information/">
                我的信息
              </Link>
            </Menu.Item>
          ):(<></>)}
          {this.props.isLogin ? (
            <Menu.Item key="4">
              <Link to="/account/">
                账号管理
              </Link>
            </Menu.Item>
          ):(<></>)}
          {this.props.isLogin ? (
            <Menu.Item key="5">
              <a onClick={this.props.logout} href="/">
                退出账号
              </a>
            </Menu.Item>
          ) : (
            <Menu.Item key="4">
              <Link to="/login/">
                登录
              </Link>
            </Menu.Item>
          )}
        </Menu>
      );

      return (
      <Dropdown overlay={menu} placement="bottomCenter">
        <Icon type="menu" style={{"color": "#61dafb", "fontSize": "28px", "lineHeight": "64px", "width": "100%"}} />
      </Dropdown>)
    }
  }

  const mapStateToProps = state =>{
    return {
      loginState:state.loginState,
    }
  }


export default connect(mapStateToProps)(withRouter(NavBar));