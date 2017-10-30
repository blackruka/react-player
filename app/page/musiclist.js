import React from 'react';
import MusicListItem from '../components/musiclistitem'
import { Link } from 'react-router';

let MusicList = React.createClass({
	render(){
		let listEle = null;
		listEle= this.props.musicList.map((item) =>{
			return(
				
				<MusicListItem
					focus={item ===this.props.currentMusicItem}
					key={item.id}
					musicItem={item}
				>
				{item.title}
				</MusicListItem>

				);
		});
		return (
			<div>
			<ul>
			{listEle}
			<li className="components-listitem row"><Link to="/">返回</Link></li>
			</ul>
			</div>
			)
	}
})

export default MusicList;