import React, { Component } from "react";
import "./reactions.css";
import Reaction from "../reaction/reaction";

class Reactions extends Component {
    render() {
        const { reactions } = this.props;
        const reactionsList = reactions && reactions.map(item => {
            return (
                <Reaction
                    key={item.id}
                    item={item}
                    handleReaction={this.props.handleReaction}    
                />
            )
        })
        return (
            <div className="reactions-wrapper">
                {reactionsList}
            </div>
        )
    }
}

export default Reactions;