var React = require("react");

module.exports = React.createClass({
	render:function(){
		return(
			<div className="panel panel-default">
				<div className="panel-heading">
					Game ID: {this.props.info.game_id} 
				</div>
				<div className="panel-body">
				Score: {this.props.info.score}
				</div>
			</div>
		)
	}
})