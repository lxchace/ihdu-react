import React, { Component } from 'react';
import { Select, Input, Table, Tag, Row, Col, Drawer, Descriptions, message } from "antd";

import './allCourse.css';
import { request } from "./axiosHandle";

const { Option } = Select;
const { Search } = Input;

class CoursePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            course: {
                code: 400,
                msg: null,
                data: [],
                pagination: {
                    current: 1,
                    pageSize: 15,
                    total: 0,
                },
            },
            sel: {
                xn: "2019-2020",
                xq: "1",
                search: null,
            }
        };
        this.changeTable = this.changeTable.bind(this);
        this.changeXN = this.changeXN.bind(this);
        this.changeXQ = this.changeXQ.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    getCourse(url){
        return request().get(url);
    }

    changeTable = async(page=0, xn=null, xq=null, search=null) => {
        let sel = this.state.sel;
        let page_cur = page? page:1;
        let xn_cur = xn? xn: sel.xn;
        let xq_cur = xq? xq: sel.xq;
        let search_cur = search? search: sel.search;
        let url = "/api/course/all/";
        url = url+"?page="+page_cur;
        if(xn_cur){
            url = url+"&xn="+xn_cur;
        }
        if(xq_cur){
            url = url+"&xq="+xq_cur;
        }
        if(xn||xq){
            search_cur = null;
        }
        if(search_cur){
            url = url+"&search="+search_cur;
        }

        let res = await this.getCourse(url);
        this.setState({
            course: {
                    code: res.code,
                    msg: res.msg,
                    data: res.data.items,
                    pagination: {
                        current: res.data.page,
                        pageSize: res.data.per_page,
                        total: res.data.total,
                    },
            },
            sel: {
                xn: xn_cur? xn_cur:this.state.sel.xn,
                xq: xq_cur? xq_cur:this.state.sel.xq,
                search: search_cur? search_cur:this.state.search,
            },
        });
    }

    changeXN(value){
        this.changeTable(undefined,value);
    }

    changeXQ(value){
        this.changeTable(undefined,undefined,value);
    }

    handleSearch(value){
        this.changeTable(undefined,undefined,undefined,value);
    }

    render(){
        return (
            <div className="course-page">
                <SelBar sel={this.state.sel} handleXNChange={this.changeXN} handleXQChange={this.changeXQ} handleSearch={this.handleSearch} />
                <CourseInf course={this.state.course} handleTableChange={this.changeTable} />
            </div>
        )
    }
    
}

class SelBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            xn: this.props.sel.xn,
            xq: this.props.sel.xq,
            search: this.props.sel.search,
            allxn: [],
            allxq: [],
        }
        this.changeSearch = this.changeSearch.bind(this);
    }

    getXNXQ(){
        return request().get("/api/course/xnxq/");
    }

    componentDidMount = async() => {
        let res = await this.getXNXQ();
        if(res.data){
            this.setState({
                allxn: res.data.xn,
                allxq: res.data.xq,
            }) 
        }else{
            console.log(res);
            message.error("获取所有学年学期失败，请刷新页面重试！");
        }
    }

    changeSearch(e){
        this.setState({
            search: e.target.value,
        })
    }

    render(){
        let allxn = this.state.allxn;
        let allxq = this.state.allxq;
        const xns = allxn.map((xn)=>(<Option value={xn} key={xn}>{xn}</Option>));
        const xqs = allxq.map((xq)=>(<Option value={xq} key={xq}>{xq}</Option>));
        return (
            <Row className="course-sel">
                <Col className="sel" md={4} lg={4} xl={4} xxl={4}>
                    学年：
                    <Select defaultValue={this.props.sel.xn} style={{ width: 120 }} onChange={this.props.handleXNChange}>
                    {xns}
                    </Select>
                </Col>
                <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} style={{ height: "10px" }} />
                <Col className="sel" md={4} lg={4} xl={4} xxl={4}>
                    学期：
                    <Select defaultValue={this.props.sel.xq} style={{ width: 120 }} onChange={this.props.handleXQChange}>
                    {xqs}
                    </Select>
                </Col>
                <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} style={{ height: "10px" }} />
                <Col md={15} lg={15} xl={15} xxl={15}>
                    <Search
                    placeholder="请输入查询信息~"
                    onSearch={this.props.handleSearch}
                    style={{ width: 200, float: "right" }}
                    value={this.state.search}
                    onChange={this.changeSearch}
                    />
                </Col>
            </Row>
        )
    }
}

class CourseInf extends Component{
    
    constructor(props){
        super(props);
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
                title: '状态',
                dataIndex: 'courseStatus',
                key: 'courseStatus',
                width: 60,
                align: "center",
                render: (courseStatus) => {
                    let color = courseStatus === "已开" ? "green":"volcano";
                    return (
                        <span>
                            <Tag color={color} key={courseStatus}>
                                {courseStatus}
                            </Tag>
                        </span>
                    )
                }
            },{
                title: '课程号',
                dataIndex: 'courseNumber',
                key: 'courseNumber',
                width: 100,
                align: "center",
                render: (courseNumber) => (
                    (courseNumber||"").split("-")[3]
                )
            },{
                title: '课程名',
                dataIndex: 'courseName',
                key: 'courseName',
                width: 200,
                align: "center",
                ellipsis: true,
            },{
                title: '任课教师',
                dataIndex: 'teacher',
                key: 'teacher',
                width: 100,
                align: "center",
                render: (teacher) => {
                    let teachers = (teacher||"").split("/");
                    teachers = teachers.map( (t, index) => (
                        <Tag color="geekblue" key={index}>
                            {t}
                        </Tag>
                    ))
                    return (
                        <span>
                            {teachers}
                        </span>
                    )
                }
            },{
                title: '学分',
                dataIndex: 'credit',
                key: 'credit',
                width: 60,
                align: "center",
            },{
                title: '上课时间',
                dataIndex: 'courseTime',
                key: 'courseTime',
                width: 200,
                align: "center",
                render: (courseTime) => {
                    let time = (courseTime||"").split(";");
                    time = time.map( (t, index) => (
                        <Tag color="geekblue" key={index}>
                            {t}
                        </Tag>
                    ))
                    return (
                        <span>
                            {time}
                        </span>
                    )
                }
            },{
                title: '上课教室',
                dataIndex: 'courseClassroom',
                key: 'courseClassroom',
                width: 200,
                align: "center",
                render: (courseClassroom) => {
                    let rooms = (courseClassroom||"").split(";");
                    rooms = rooms.map( (t, index) => (
                        <Tag color="geekblue" key={index}>
                            {t}
                        </Tag>
                    ))
                    return (
                        <span>
                            {rooms}
                        </span>
                    )
                }
            },{
                title: '开课学院',
                dataIndex: 'courseCollege',
                key: 'courseCollege',
                width: 200,
                align: "center",
                ellipsis: true,
            }
        ];
        this.state = {
            columns: columns,
            isDrawer: false,
            detail: {
                courseClass: "", 
                courseClassroom: "", 
                courseCollege: "", 
                courseName: "", 
                courseNature: "", 
                courseNumber: "", 
                courseStatus: "", 
                courseTime: "", 
                credit: 1.0, 
                examMethod: "", 
                id: 1, 
                startEndWeek: "", 
                teacher: "", 
                xn: "2019-2020", 
                xq: 1
              },
        };
        this.onChange = this.onChange.bind(this);
        this.showDrawer = this.showDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    componentDidMount(){
        this.props.handleTableChange();
    }

    onChange(pagination, filters, sorter, extra){
        this.props.handleTableChange(pagination.current);
    }

    closeDrawer(){
        this.setState({
            isDrawer: false,
        })
    }

    showDrawer(record){
        this.setState({
            isDrawer: true,
            detail: record,
        })
    }

    render(){
        return (
            <div>
                <div className="course-inf">
                    <Table
                        rowKey={record => record.id}
                        columns={this.state.columns}
                        dataSource={this.props.course.data}
                        pagination={this.props.course.pagination}
                        onChange={this.onChange}
                        scroll={{ scrollToFirstRowOnChange: true, x: true }}
                        onRow={record=>{
                            return {
                              onClick: event => { this.showDrawer(record) }, // 点击行
                              onDoubleClick: event => {},
                              onContextMenu: event => {},
                              onMouseEnter: event => {}, // 鼠标移入行
                              onMouseLeave: event => {},
                            };
                        }}
                    />
                </div>
                <CourseDetail onClose={this.closeDrawer} visible={this.state.isDrawer} detail={this.state.detail}/>
            </div>
        )
    }
}

class CourseDetail extends Component{

    genTag1 = (data) => {
        let item = (data||"").split(",");
        item = item.map( (t, index) => (
            <Tag color="geekblue" key={index}>
                {t}
            </Tag>
        ))
        return (
            <span>
                {item}
            </span>
        )
    }

    genTag2 = (data) => {
        let item = (data||"").split(";");
        item = item.map( (t, index) => (
            <Tag color="geekblue" key={index}>
                {t}
            </Tag>
        ))
        return (
            <span>
                {item}
            </span>
        )
    }

    genTag3 = (courseStatus) => {
        let color = courseStatus === "已开" ? "green":"volcano";
        return (
            <span>
                <Tag color={color} key={courseStatus}>
                    {courseStatus}
                </Tag>
            </span>
        )
    }
    
    genTag4 = (data) => {
        let item = (data||"").split("/");
        item = item.map( (t, index) => (
            <Tag color="geekblue" key={index}>
                {t}
            </Tag>
        ))
        return (
            <span>
                {item}
            </span>
        )
    }

    render(){
        let data = this.props.detail;
        return (
            <Drawer
              title="课程详情"
              placement="right"
              closable={true}
              onClose={this.props.onClose}
              visible={this.props.visible}
              width="auto"
            >
              <Descriptions column={1} layout="vertical" bordered>
                  <Descriptions.Item label="学年">{data.xn}</Descriptions.Item>
                  <Descriptions.Item label="学期">{data.xq}</Descriptions.Item>
                  <Descriptions.Item label="开课状态">{this.genTag3(data.courseStatus)}</Descriptions.Item>
                  <Descriptions.Item label="选课号">{data.courseNumber}</Descriptions.Item>
                  <Descriptions.Item label="课程名">{data.courseName}</Descriptions.Item>
                  <Descriptions.Item label="任课教师">{this.genTag4(data.teacher)}</Descriptions.Item>
                  <Descriptions.Item label="学分">{data.credit}</Descriptions.Item>
                  <Descriptions.Item label="课程性质">{data.courseNature}</Descriptions.Item>
                  <Descriptions.Item label="考查方式">{data.examMethod}</Descriptions.Item>
                  <Descriptions.Item label="起止周">{data.startEndWeek}</Descriptions.Item>
                  <Descriptions.Item label="上课时间">{this.genTag2(data.courseTime)}</Descriptions.Item>
                  <Descriptions.Item label="上课教室">{this.genTag2(data.courseClassroom)}</Descriptions.Item>
                  <Descriptions.Item label="默认班级">{this.genTag1(data.courseClass)}</Descriptions.Item>
              </Descriptions>
            </Drawer>
        )
    }
}

export default CoursePage;