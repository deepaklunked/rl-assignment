import React, { Component } from "react";
import "./reaction.css"
import Tooltip from "../tooltip/tooltip";


class Reaction extends Component {
    initialState = {
        "isHovered": false
    }

    state = this.initialState;

    showTooltip() {
        this.setState({
            "isHovered": true
        })
    }

    hideTooltip() {
        this.setState(this.initialState);
    }

    handleClick(id) {
        this.props.handleReaction(id);
    }

    render() {
        const { item } = this.props
        const { name, emoji } = item;
        const { isHovered } = this.state;
        const emojiClasses = "emoji" + (isHovered ? " hovered": "");
        return (
            <div
                className="reaction"
                onMouseEnter={() => {this.showTooltip()}}
                onMouseLeave={() => {this.hideTooltip()}}
                onClick={() => {this.handleClick(item)}}
            >
                {isHovered ? 
                    <Tooltip content={name} /> : ""   
                }
                <span className={emojiClasses}>{emoji}</span>
            </div>
        )
    }
}

export default Reaction;