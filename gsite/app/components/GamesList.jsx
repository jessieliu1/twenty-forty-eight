var React = require("react");
var GameInfo = require("./GameInfo.jsx")

module.exports = React.createClass({
   render:function(){
       return(
           <div className="row">
                <div className="col-md-6">
                    {
                        this.props.games.map(function(g,index){
                            return(
                                <GameInfo info={g} key={"game"+index} />
                            )         
                        })
                    }
                </div>
           </div>
       )
   } 
});
