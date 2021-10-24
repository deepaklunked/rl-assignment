import React, { Component } from "react";
import trigger from "../../assets/icons/trigger.svg";
import "./trigger.css";
import Reactions from "../reactions/reactions";
// import axios from "axios";
// import { BASE_URL } from "../../App";

class Trigger extends Component {
    // API_URL = `${BASE_URL}/user_content_reactions`;

    initialState = {
        isTriggered: false,
        contentReactions: new Set(),
        // newReactions: new Set(),
    }

    state = this.initialState;

    componentDidMount() {
        const { contentReactions } = this.props;
        this.setState({ contentReactions })
    }

    // handleReaction = async (item, contentId) => {
    //     const { contentReactions, newReactions } = this.state;
    //     await new Promise((resolve, reject) => {
    //         contentReactions.forEach((x) => {
    //             if (x.id === item.id) {
    //                 if (x.isCurrentUser === true) {
    //                     const newReaction = Array.from(newReactions).find(x => x.reaction_id === item.id);
    //                     axios.delete(`${this.API_URL}/${newReaction.id}`).then(response => {
    //                         x.isCurrentUser = false;
    //                         x.count--;
    //                         newReactions.delete(newReaction);
    //                         resolve();
    //                     }).catch(e => reject());
    //                 } else {
    //                     axios.post(this.API_URL, {
    //                         "user_id": 31, // assuming this is a new user
    //                         "content_id" : contentId,
    //                         "reaction_id": item.id
    //                     }).then(response => {
    //                         x.isCurrentUser = true;
    //                         x.count++;
    //                         newReactions.add(response.data);
    //                         this.handleTrigger();
    //                         resolve();
    //                     }).catch(e => reject());
    //                 }
    //             }
    //         })
    //     });
    //     this.setState({ contentReactions, newReactions });
	// }
    
    handleTrigger = () => {
        const { isTriggered } = this.state;
        this.setState({
            "isTriggered": !isTriggered
        })
    }

    render() {
        const { isTriggered, contentReactions } = this.state;
        const { contentId, reactions, handleReaction } = this.props;
        const reacted = Array.from(contentReactions).map(item => {
            const classes = "added-reaction" + (item.isCurrentUser ? " current-user" : "");
            return (
                <div
                    key={item.id}
                    className={classes}
                    onClick={() => {
                        if (item.isCurrentUser) {
                            handleReaction(item, contentId)
                        }
                    }}
                >
                    <span className="emoji">{item.emoji} · {item.count}</span>
                </div>
            )
        })
        return (
            <div className="trigger-wrapper">
                {reacted}
                <div className="trigger-with-reactions">
                    {isTriggered ? (
                        <Reactions
                            contentId={contentId}
                            reactions={reactions}
                            handleReaction={this.props.handleReaction}
                        />) : ""
                    }
                    <button
                        className="trigger"
                        onClick={this.handleTrigger}
                        onBlur={() => {
                            setTimeout(() => {
                                this.handleTrigger();
                            }, 300);
                        }}
                    >
                        <img src={trigger} alt="+" />
                    </button>
                </div>
            </div>
        )
    }
}

export default Trigger;