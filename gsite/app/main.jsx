var React = require("react");
var ReactDOM = require("react-dom");
var GamesList = require("./components/GamesList.jsx");

var _games = [{game_id: 001, score: 12},
                {game_id: 1.01, score: 5}];
                
function render(){
    ReactDOM.render(<GamesList games={_games} />, document.getElementById("container"));    
}
render();