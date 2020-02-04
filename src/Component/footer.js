import React, { Component } from 'react'
import './footer.css'

class FootBar extends Component{

    render(){
        return (
            <div className="copyright">©2019-2020 lxchace.cn 版权所有 <a href="http://www.beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">赣ICP备16011159号</a></div>
        )
    }
}

export default FootBar;