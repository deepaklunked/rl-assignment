import React, { Component } from "react";
import trigger from "../../assets/icons/trigger.svg";
import "./trigger.css";
import Summary from "../summary/summary";
import Reactions from "../reactions/reactions";
import axios from "axios";
import { BASE_URL } from "../../App";

class Trigger extends Component {
    API_URL = `${BASE_URL}/user_content_reactions`;

    initialState = {
        isTriggered: false,
        showSummary: false,
        userReactions: null,
        contentReactions: new Set(),
        newReactions: new Set(),
        userContentReactions: new Set(),
        navList: [{
            content: 'All',
            isActive: true
        }]
    }

    state = this.initialState;

    async componentDidMount() {
        await this.getUserReactions();
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
                            "user_id": 1, // assuming this is user 1
                            "content_id" : contentId,
                            "reaction_id": item.id
                        }).then(response => {
                            x.isCurrentUser = true;
                            x.count++;
                            newReactions.add(response.data);
                            this.handleTrigger();
                            resolve();
                        }).catch(e => {
                            console.log("error in creation", e)
                            reject();
                        });
                    }
                }
            })
        });
        this.getUserReactions();
        this.setState({ contentReactions, newReactions });
	}
    
    handleTrigger = () => {
        const { isTriggered } = this.state;
        this.setState({
            "isTriggered": !isTriggered
        })
    }

    handleNavigation = (item) => {
        const { navList } = this.state;
        navList.forEach(nav => {
            nav.isActive = (nav.content.split(" ")[0] === item);
        })
        this.setState( {navList });
    }

    showSummary = () => {
        this.setState({
            "showSummary": true
        });
    }

    hideSummary = () => {
        this.setState({
            "showSummary": false
        });
    }

    filterContent = (emoji) => {
        const { userContentReactions } = this.state;
        userContentReactions.forEach(item => {
            item.isVisible = (emoji === "All") ? true : (item.reaction.emoji === emoji);
        })
        this.handleNavigation(emoji);
        this.showSummary();
    }

    getUserReactions = async () => {
        const { contentId } = this.props;
        const userReactions = await axios.get(`${BASE_URL}/user_content_reactions?content_id=${contentId}`);
        this.setState({
            userReactions: userReactions.data
        });
        this.updateReactionData();
    }

    updateReactionData = () => {
        const { users, reactions } = this.props;
        const { contentReactions, userReactions } = this.state;
        const userContentReactions = new Set();
        const { navList } = this.initialState;
        if (Array.from(contentReactions).length === 0) {
            reactions.forEach(reaction => {
                const item = {};
                Object.assign(item, reaction);
                const filteredReactions = userReactions.filter(userReaction => (userReaction.reaction_id === reaction.id));
                item.count = filteredReactions.length;
                contentReactions.add(item);
            });
        }
        if (Array.from(userContentReactions).length === 0) {
            userReactions.forEach(userReaction => {
                const item = {};
                Object.assign(item, userReaction);
                const userData = users.find(user => (userReaction.user_id === user.id));
                const reactionData = reactions.find(reaction => (userReaction.reaction_id === reaction.id));
                if(userData && reactionData) {
                    item.user = userData;
                    item.reaction = reactionData;
                    item.isVisible = true;
                    item.user.fullName = `${item.user.first_name} ${item.user.last_name}`
                    userContentReactions.add(item);
                }
            });
        }
        const list = Array.from(contentReactions).map(item => {
            return ({
                content: `${item.emoji} · ${item.count}`,
                isActive: false 
            });
        })
        this.setState({ contentReactions, userContentReactions, "navList": navList.concat(list) });
    }

    render() {
        const { isTriggered, showSummary, contentReactions, userContentReactions, navList } = this.state;
        const { contentId, users, reactions, userReactions } = this.props;
        const summary = (
            <Summary
                contentId={contentId}
                reactions={reactions}
                users={users}
                userReactions={userReactions}
                contentReactions={contentReactions}
                userContentReactions={userContentReactions}
                navList={navList}
                filterContent={this.filterContent}
                showSummary={this.showSummary}
            />
        );
        const reacted = Array.from(contentReactions).map(item => {
            if(item.count > 0) {
                const classes = "added-reaction" + (item.isCurrentUser ? " current-user" : "");
                return (
                    <div
                        key={item.id}
                        className={classes}
                        onClick={() => {
                            if (item.isCurrentUser) {
                                this.handleReaction(item, contentId)
                            }
                        }}
                        onMouseEnter={() => {
                            this.filterContent(item.emoji)
                        }}
                    >
                        <span className="emoji">{item.emoji} · {item.count}</span>
                    </div>
                );
            } else {
                return "";
            }
        });
        return (
            <div className="trigger-and-summary-container">
                { showSummary ? summary : ""}
                <div
                    className="trigger-wrapper"
                    onMouseLeave={this.hideSummary}
                >
                    {reacted}
                    <div className="trigger-with-reactions">
                        {isTriggered ? (
                            <Reactions
                                contentId={contentId}
                                reactions={reactions}
                                handleReaction={this.handleReaction}
                            />) : ""
                        }
                        <button
                            className="trigger"
                            onClick={this.handleTrigger}
                        >
                            <img src={trigger} alt="+" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Trigger;