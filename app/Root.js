import React from 'react'
import Header from './components/header'
import Player from './page/player'
import { MUSIC_LIST } from './config/music-list'
import MusicList from './page/musiclist'
import { Router, IndexRoute , Link, Route, hashHistory } from 'react-router'
import Pubsub from 'pubsub-js'
import { randomRange } from './utils/util';
let App = React.createClass({
		getInitialState(){
		return{
			currentMusicItem:MUSIC_LIST[0],
			musicList:MUSIC_LIST,
			repeatType: 'cycle'
		}
	},
	playMusic(item) {
		$("#player").jPlayer("setMedia", {
			mp3: item.file
		}).jPlayer('play');
		this.setState({
			currentMusicItem: item
		});
	},
	playNext(type = 'next'){
		let index = this.findMusicItemIndex(this.state.currentMusicItem);
		let newIndex = null;
		let musicListLength = this.state.musicList.length;
		if(type === 'next'){
			newIndex = (index + 1) % musicListLength;
		} else {
			newIndex = (index - 1 + musicListLength) % musicListLength;
		}
		this.playMusic(this.state.musicList[newIndex])
	},
	findMusicItemIndex(musicItem){
		return this.state.musicList.indexOf(musicItem)
	},
	componentDidMount(){
		$('#player').jPlayer({
			supplied:'mp3',
			wmode:'window'
		});
		this.playMusic(this.state.currentMusicItem);
		$("#player").bind($.jPlayer.event.ended, (e) => {
			this.playWhenEnd();
		});
		Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem) => {
			this.setState({
				musicList:this.state.musicList.filter(item => {
					return item != musicItem;
				})
				
			});
			if(this.state.currentMusicItem === musicItem){
					this.playNext('next');
				};
		});
		Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem) => {
			this.playMusic(musicItem)
		});
		Pubsub.subscribe('PLAY_PREV',(msg,musicItem) => {
			this.playNext('prev')
		});
		Pubsub.subscribe('PLAY_NEXT',(msg,musicItem) => {
			this.playWhenEnd()
		});
		let repeatList = [
			'cycle',
			'once',
			'random'
		];
		PubSub.subscribe('CHANAGE_REPEAT', () => {
			let index = repeatList.indexOf(this.state.repeatType);
			index = (index + 1) % repeatList.length;
			this.setState({
				repeatType: repeatList[index]
			});
		});
	},
	playWhenEnd() {
		if (this.state.repeatType === 'random') {
			let index = this.findMusicItemIndex(this.state.currentMusicItem);
			let randomIndex = randomRange(-1, this.state.musicList.length-1);
			while(randomIndex === index) {
				randomIndex = randomRange(-1, this.state.musicList.length-1);
			}
			this.playMusic(this.state.musicList[randomIndex]);
			console.log(randomIndex)
		} else if (this.state.repeatType === 'once') {
			this.playMusic(this.state.currentMusicItem);
		} else {
			this.playNext();
		}
	},
	componentWillUnMount(){
		Pubsub.unsubscribe('PLAY_MUSIC');
		Pubsub.unsubscribe('DELETE_MUSIC');
		Pubsub.unsubscribe('PLAY_NEXT');
		Pubsub.unsubscribe('PLAY_PREV');
		$('#player').unbind($.jPlayer.event.ended);
		PubSub.unsubscribe('CHANAGE_REPEAT');
	},
	render(){
		return(
			<div>
				<Header/>
				{React.cloneElement(this.props.children, this.state)}
			</div>			
			);
	}
});

let Root = React.createClass({
	render(){
		return(
			<Router history = {hashHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={Player}></IndexRoute>
					<Route path="list" component={MusicList}></Route>
				</Route>
			</Router>
			)
	}
});

export default Root;