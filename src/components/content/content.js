import React, { Component } from "react";
import "./content.css";
import Trigger from "../trigger/trigger";
import Summary from "../summary/summary";
import axios from "axios";
import { BASE_URL } from "../../App";

class Content extends Component {
    API_URL = `${BASE_URL}/user_content_reactions`;

    initialState = {
        contentReactions: new Set(),
        newReactions: new Set(),
        userContentReactions: new Set(),
    }

    state = this.initialState;

    componentDidMount() {
        console.log("content componentDidMount")
        const { id, users, reactions, userReactions } = this.props;
        const { contentReactions, userContentReactions } = this.state;
        reactions.forEach(reaction => {
            const item = {};
            Object.assign(item, reaction);
            const filteredReactions = userReactions.filter(userReaction => 
                (userReaction.reaction_id === reaction.id) && userReaction.content_id === id
            );
            item.count = filteredReactions.length;
            if (item.count > 0) contentReactions.add(item);
        });
        userReactions.forEach(userReaction => {
            const item = {};
            Object.assign(item, userReaction);
            const userData = users.find(user => 
                (userReaction.user_id === user.id) && userReaction.content_id === id
            );
            const reactionData = reactions.find(reaction => 
                (userReaction.reaction_id === reaction.id) && userReaction.content_id === id
            );
            if(userData && reactionData) {
                item.user = userData;
                item.reaction = reactionData;
                item.isVisible = true;
                item.user.fullName = `${item.user.first_name} ${item.user.last_name}`
                userContentReactions.add(item);
            }
        });
        this.setState({ contentReactions, userContentReactions });
    }

    handleReaction = async (item, contentId) => {
        const { contentReactions, newReactions } = this.state;
        await new Promise((resolve, reject) => {
            contentReactions.forEach((x) => {
                if (x.id === item.id) {
                    if (x.isCurrentUser === true) {
                        const newReaction = Array.from(newReactions).find(x => x.reaction_id === item.id);
                        axios.delete(`${this.API_URL}/${newReaction.id}`).then(response => {
                            x.isCurrentUser = false;
                            x.count--;
                            newReactions.delete(newReaction);
                            resolve();
                        }).catch(e => {
                            console.log("error in deletion", e)
                            reject();
                        });
                    } else {
                        axios.post(this.API_URL, {
                            "user_id": 1, // assuming this is user 1, Lizette Phipen
                            "content_id" : contentId,
                            "reaction_id": item.id
                        }).then(response => {
                            x.isCurrentUser = true;
                            x.count++;
                            newReactions.add(response.data);
                            resolve();
                        }).catch(e => {
                            console.log("error in creation", e)
                            reject();
                        });
                    }
                }
            })
        });
        this.setState({ contentReactions, newReactions });
	}

    render() {
        console.log("content render");
        const { id, users, reactions, userReactions } = this.props;
        const { contentReactions, userContentReactions } = this.state;
        const summary = (
            <Summary
                contentId={id}
                reactions={reactions}
                users={users}
                userReactions={userReactions}
                contentReactions={contentReactions}
                userContentReactions={userContentReactions}
            />
        )

        return (
            <div className="content-wrapper">
                {(Array.from(contentReactions).length > 0 && Array.from(userContentReactions).length > 0) ? summary : ""}
                <div className="content">
                    <span>Content {id}</span>
                    <Trigger
                        contentId={id}
                        reactions={reactions}
                        userReactions={userReactions} 
                        contentReactions={contentReactions}
                        handleReaction={this.handleReaction} 
                    />
                </div>
            </div>

        )
    }
}

export default Content;