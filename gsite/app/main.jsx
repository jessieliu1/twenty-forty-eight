var React = require("react");
var ReactDOM = require("react-dom");
var Router = require("react-router").Router
var Route = require('react-router').Route
var Link = require('react-router').Link


var GamesList = require("./components/GamesList.jsx");

var _games = [{game_id: 001, score: 12},
                {game_id: 1.01, score: 5}];
                
function render(){
	var destination = document.getElementById("container")

	ReactDOM.render(
		<GamesList games={_games} />,
		destination
	);   



}
render();