import React, { Component } from 'react';
import { Select, Row, Col, Button, message, Table, Tag, Icon, Tooltip } from "antd";

import './grades.css';
import { request } from './axiosHandle';

const { Option } = Select;

class GradesPage extends Component{
    render(){
        return (
            <div className="grades-page">
                <GradesTable />
            </div>
        )
    }
}

// class GradesBar extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             allXH: [],
//         }
//         this.handleXHchange = this.handleXHchange.bind(this);
//     }

//     getXH(){
//         return request().get("/api/hdu/detail/");
//     }

//     componentDidMount = async() => {
//         let res = await this.getXH();
//         this.setState({
//             allXH: res.data,
//             xhID: 0,
//         })
//     }

//     refreshGrade = async() => {
//         let id = this.state.xhID;
//         let url = "/api/jwxt/"+id+"/refreshgrades/";
//         let res = await request().get(url);
//         if(res.code === 201){
//             message.info("请求已发送，请稍等片刻~");
//         }else{
//             message.error("请求失败，请重试！");
//         }
//         return
//     }

//     handleXHchange(value){
//         this.setState({
//             xhID: value,
//         })
//     }

//     render(){
//         let xhs = this.state.allXH;
//         let xhsOption = xhs.map((fullXH) => (<Option value={fullXH.id} key={fullXH.id}>{fullXH.xh}</Option>))
//         return (
//             <Row className="grades-sel">
//                 <Col className="sel">
//                     学号：
//                     <Select defaultValue="" style={{ width: 120 }} onChange={this.handleXHchange}>
//                     {xhsOption}
//                     </Select>
//                     <Button className="sel" type="primary" onClick={this.refreshGrade}>刷新成绩</Button>
//                 </Col>
//             </Row>
//         )
//     }
// }

class GradesTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            grades: [],
            points: 5,
            update_time: null,
            allXN: [],
            allXQ: [],
            allXH: [],
            XH_now: {
                key: 0,
                label: "请绑定学号",
            },
            xn: "",
            xq: "",
            selectedGrades: [],
        }
        this.handleXHchange = this.handleXHchange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    getGrades(id_in, xn_in, xq_in){
        let id = id_in? id_in:this.state.XH_now.key;
        let xn = xn_in? xn_in:this.state.xn;
        let xq = xq_in? xq_in:this.state.xq;
        let data = {
            xn: xn,
            xq: xq
        }
        return request().get("/api/jwxt/"+id+"/grades/", {params: data})
    }
    
    getXH(){
        return request().get("/api/hdu/detail/");
    }

    getXNXQ(){
        return request().get("/api/course/xnxq/");
    }

    refreshGrade = async() => {
        let id = this.state.XH_now.key;
        let url = "/api/jwxt/"+id+"/refreshgrades/";
        let res = await request().get(url);
        if(res.code === 201){
            message.info("请求已发送，页面稍后将自动更新~");
            let cnt = 0;
            let timer = setInterval(async() => {
                let newData = await this.getGrades();
                if(newData.code === 200){
                    this.setState({
                        grades: newData.data.grades,
                        points: newData.data.points,
                        update_time: newData.data.update_time,
                        xn: newData.data.xn,
                        xq: newData.data.xq,
                    })
                    clearInterval(timer);
                    message.success("成绩更新成功！（若最后更新时间未变，请检查学号密码~）");
                }else if(cnt++ >= 5){
                    message.error("请检查教务系统可达（教务系统夜间维护）或者学号密码是否正确！", 10);
                    clearInterval(timer);
                }
                console.log("timer~", cnt)
            }, 2000)
        }else{
            message.error("请求失败，请重试！");
        }
        return
    }

    calculatePoint = () => {
        let selectedGrades = this.state.selectedGrades;
        let creditSum = 0;
        let creditXpointSum = 0;
        for ( var i in selectedGrades ) {
            creditSum += parseFloat(selectedGrades[i].credit);
            creditXpointSum += (parseFloat(selectedGrades[i].credit) * selectedGrades[i].point);
        }
        this.setState({
            points: creditXpointSum / (creditSum ? creditSum : 1),
        })
        message.info("计算完成，结果如“平均学分绩点”所示~")
        return
    }

    handleSelection(selectedRowKeys, selectedRows){
        this.setState({
            selectedGrades: selectedRows,
        })
        return
    }

    handleXHchange = async(value) => {
        let res = await this.getGrades(value.key);
        if(res.code === 200){
            this.setState({
                XH_now: value,
                grades: res.data.grades,
                points: res.data.points,
                update_time: res.data.update_time,
                xn: res.data.xn,
                xq: res.data.xq,
            })
        }else if(res.code === 410){
            this.setState({
                XH_now: value,
                grades: [],
                points: 5,
                update_time: null,
            })
            message.error("请先点击刷新成绩，若一直未出现成绩，请检查学号密码是否正确！");
        }else{
            this.setState({
                XH_now: value,
                grades: [],
                points: 5,
                update_time: null,
            })
            message.error("获取成绩失败，请稍后再试！");
        }
    }

    handleXNchange = async(value) => {
        let res = await this.getGrades(undefined, value, undefined);
        if(res.code === 200){
            this.setState({
                grades: res.data.grades,
                points: res.data.points,
                update_time: res.data.update_time,
                xn: value,
            })
        }else if(res.code === 410){
            this.setState({
                XH_now: value,
                grades: [],
                points: 5,
                update_time: null,
            })
            message.error("请先点击刷新成绩，若一直未出现成绩，请检查学号密码是否正确！");
        }else{
            this.setState({
                XH_now: value,
                grades: [],
                points: 5,
                update_time: null,
            })
            message.error("获取成绩失败，请稍后再试！");
        }
    }

    handleXQchange = async(value) => {
        let res = await this.getGrades(undefined, undefined, value);
        if(res.code === 200){
            this.setState({
                grades: res.data.grades,
                points: res.data.points,
                update_time: res.data.update_time,
                xq: value,
            })
        }else if(res.code === 410){
            this.setState({
                XH_now: value,
                grades: [],
                points: 5,
                update_time: null,
            })
            message.error("请先点击刷新成绩，若一直未出现成绩，请检查学号密码是否正确！");
        }else{
            this.setState({
                XH_now: value,
                grades: [],
                points: 5,
                update_time: null,
            })
            message.error("获取成绩失败，请稍后再试！");
        }
    }

    // handleFilter = async(xn, xq) => {
    //     this.setState({
    //         xn: xn,
    //         xq: xq,
    //     });
    //     let res = await this.getGrades(this.state.XH_now.key);
    //     console.log(res);
    //     if(res.code === 200){
    //         this.setState({
    //             grades: res.data.grades,
    //             points: res.data.points,
    //             update_time: res.data.update_time,
    //         })
    //     }else{
    //         this.setState({
    //             grades: [],
    //             points: 5,
    //             update_time: null,
    //         })
    //         message.error("获取成绩失败，请检查学号密码是否正确！");
    //     }
    // }

    componentDidMount = async() => {
        let xnxq = await this.getXNXQ();
        if(xnxq.data){
            xnxq = xnxq.data;
        }else{
            console.log(xnxq);
            message.error("获取所有学年学期失败，请刷新页面重试！");
        }
        let res = await this.getXH();
        if(res.data.length !== 0){
            let value = {
                key: res.data[0].id,
                label: res.data[0].xh,
            }
            this.setState({
                allXH: res.data,
                XH_now: value,
                allXN: xnxq.xn,
                allXQ: xnxq.xq,
            })
            this.handleXHchange(value);
        }else{
            console.log(res);
            message.info("请先在个人中心的账号管理中绑定学号哦~");
        }
    }

    render(){
        const columns = [
            {
                title: '学年',
                dataIndex: 'xn',
                key: 'xn',
                width: 100,
                align: "center",
            },{
                title: '学期',
                dataIndex: 'xq',
                key: 'xq',
                width: 60,
                align: "center",
            },{
                title: '课程名',
                dataIndex: 'courseName',
                key: 'courseName',
                width: 200,
                align: "center",
            },{
                title: '选课号',
                dataIndex: 'courseID',
                key: 'courseID',
                width: 100,
                align: "center",
            },{
                title: '课程学分',
                dataIndex: 'credit',
                key: 'credit',
                width: 60,
                align: "center",
            },{
                title: '课程性质',
                dataIndex: 'courseNature',
                key: 'courseNature',
                width: 100,
                align: "center",
            },{
                title: '平时成绩',
                dataIndex: 'usualGrade',
                key: 'usualGrade',
                width: 60,
                align: "center",
                render: (grade) => {
                    if(grade){
                        let color = (grade >= 60) || ["优秀", "良好", "中等", "及格"].indexOf(grade) !== -1 ? "geekblue":"red";
                        return (
                            <span>
                                <Tag color={color} key={grade}>
                                    {grade}
                                </Tag>
                            </span>
                        )
                    }else{
                        return
                    }
                },
            },{
                title: '期中成绩',
                dataIndex: 'midGrade',
                key: 'midGrade',
                width: 60,
                align: "center",
                render: (grade) => {
                    if(grade){
                        let color = (grade >= 60) || ["优秀", "良好", "中等", "及格"].indexOf(grade) !== -1 ? "geekblue":"red";
                        return (
                            <span>
                                <Tag color={color} key={grade}>
                                    {grade}
                                </Tag>
                            </span>
                        )
                    }else{
                        return
                    }
                },
            },{
                title: '实验成绩',
                dataIndex: 'experimentalGrade',
                key: 'experimentalGrade',
                width: 60,
                align: "center",
                render: (grade) => {
                    if(grade){
                        let color = (grade >= 60) || ["优秀", "良好", "中等", "及格"].indexOf(grade) !== -1 ? "geekblue":"red";
                        return (
                            <span>
                                <Tag color={color} key={grade}>
                                    {grade}
                                </Tag>
                            </span>
                        )
                    }else{
                        return
                    }
                },
            },{
                title: '期末成绩',
                dataIndex: 'finalGrade',
                key: 'finalGrade',
                width: 60,
                align: "center",
                render: (grade) => {
                    if(grade){
                        let color = (grade >= 60) || ["优秀", "良好", "中等", "及格"].indexOf(grade) !== -1 ? "geekblue":"red";
                        return (
                            <span>
                                <Tag color={color} key={grade}>
                                    {grade}
                                </Tag>
                            </span>
                        )
                    }else{
                        return
                    }
                },
            },{
                title: '总成绩',
                dataIndex: 'grade',
                key: 'grade',
                width: 60,
                align: "center",
                render: (grade) => {
                    if(grade){
                        let color = (grade >= 60) || ["优秀", "良好", "中等", "及格"].indexOf(grade) !== -1 ? "#108ee9":"#f50";
                        return (
                            <span>
                                <Tag color={color} key={grade}>
                                    {grade}
                                </Tag>
                            </span>
                        )
                    }else{
                        return
                    }
                },
            },{
                title: '绩点',
                dataIndex: 'point',
                key: 'point',
                width: 60,
                align: "center",
                render: (grade) => {
                    if(grade){
                        let color = (grade !== 0) ? "#108ee9":"#f50";
                        return (
                            <span>
                                <Tag color={color} key={grade}>
                                    {grade}
                                </Tag>
                            </span>
                        )
                    }else{
                        return
                    }
                },
            },{
                title: '补考成绩',
                dataIndex: 'retestGrade',
                key: 'retestGrade',
                width: 60,
                align: "center",
                render: (grade) => {
                    if(grade){
                        let color = (grade >= 60) || ["优秀", "良好", "中等", "及格"].indexOf(grade) !== -1 ? "#108ee9":"#f50";
                        return (
                            <span>
                                <Tag color={color} key={grade}>
                                    {grade}
                                </Tag>
                            </span>
                        )
                    }else{
                        return
                    }
                },
            },{
                title: '是否重修',
                dataIndex: 'restudy',
                key: 'restudy',
                width: 60,
                align: "center",
            },{
                title: '开课学院',
                dataIndex: 'courseCollege',
                key: 'courseCollege',
                align: "center",
                width: 150,
                ellipsis: true,
            },
        ];
        let xhsOption = this.state.allXH.map((fullXH) => (<Option key={fullXH.id}>{fullXH.xh}</Option>));
        let xnsOption = this.state.allXN.map( (fullXN) => (<Option key={fullXN}>{fullXN}</Option>) );
        xnsOption.push(<Option key="0" value="0">全部</Option>);
        let xqsOption = this.state.allXQ.map( (fullXQ) => (<Option key={fullXQ}>{fullXQ}</Option>) );
        xqsOption.push(<Option key="0" value="0">全部</Option>);
        return (
            <div>
                <Row className="grades-sel">
                    <Col className="sel" md={6} lg={6} xl={4} xxl={4}>
                        学号：
                        <Select value={this.state.XH_now} style={{ width: 120 }} onChange={this.handleXHchange} labelInValue >
                        {xhsOption}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} style={{ height: "10px" }} />
                    <Col md={10} lg={10} xl={9} xxl={9}>
                        <Tooltip
                            title="成绩并不是实时获取的哦，最后更新时间如右边所示！单击此按钮可立即刷新，等待几分钟刷新页面即可更新~"
                            placement="bottom"
                        >
                            <Button className="sel" type="primary" onClick={this.refreshGrade}>刷新成绩</Button>
                        </Tooltip>
                        <Tooltip
                            title="先勾选下列成绩，单击此按钮便可计算当前所有已勾选成绩的平均绩点！"
                            placement="bottom"
                        >
                            <Button className="sel" type="primary" onClick={this.calculatePoint}>计算绩点</Button>
                        </Tooltip>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={0} xxl={0} style={{ height: "10px" }} />
                    <Col className="sel" md={24} lg={24} xl={10} xxl={10}>
                        <span className="sTag"><Icon type="calculator" />平均学分绩点：<Tag color="#00BFFF">{this.state.points.toFixed(2)}</Tag></span>
                        <span className="sTag"><Icon type="calendar" />更新时间：<Tag>{this.state.update_time}</Tag></span>
                    </Col>
                    <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} style={{ height: "10px" }} />
                    <Col className="xnxq" md={24} lg={24} xl={13} xxl={13}>
                        学年：
                        <Select value={this.state.xn} style={{ width: 110 }} onChange={this.handleXNchange} >
                        {xnsOption}
                        </Select>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;学期：
                        <Select value={this.state.xq} style={{ width: 70 }} onChange={this.handleXQchange} >
                        {xqsOption}
                        </Select>
                    </Col>
                </Row>
                <Table columns={columns} 
                    rowKey={record => record.id}
                    dataSource={this.state.grades} 
                    scroll={{ x: true, y: "85vh" }} 
                    pagination={false} 
                    rowSelection={{type: "checkbox", onChange: this.handleSelection}}
                />
            </div>
        )
    }
}

export default GradesPage;
