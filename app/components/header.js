import React from 'react'
import './header.less'
import { Link } from 'react-router';
let Header = React.createClass({
	render(){
		return(
			<div className="com-header row">
				<Link className="-col-auto" to="/"><img src="/static/images/logo.png" width="40" alt=""  /></Link>
				<h1 className="caption" >Music Player</h1>
			</div>
			)
	}
});
export default Header;