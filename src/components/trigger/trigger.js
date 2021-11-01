import React, { Component } from "react";
import trigger from "../../assets/icons/trigger.svg";
import "./trigger.css";
import Summary from "../summary/summary";
import Reactions from "../reactions/reactions";
import axios from "axios";
import { BASE_URL } from "../../App";
import Overlay from "../overlay/overlay";

class Trigger extends Component {
    API_URL = `${BASE_URL}/user_content_reactions`;
    currentUserId = 12 // assumption;

    initialState = {
        isTriggered: false,
        shouldShowSummary: false,
        shouldShowOverlay: false,
        userReactions: null,
        contentReactions: new Set(),
        newReactions: new Set(),
        userContentReactions: new Set(),
        navList: [{
            content: 'All',
            count: 0,
            isActive: true
        }]
    }

    state = this.initialState;

    async componentDidMount() {
        await this.getUserReactions();
    }

    handleReaction = (item) => {
        const { contentReactions, newReactions, userContentReactions } = this.state;
        const { contentId, users, reactions } = this.props;
        let tempVariableForReaction, apiPromise, newReaction, reactionType;
        contentReactions.forEach((x) => {
            if (x.id === item.id) {
                tempVariableForReaction = x;
                x.isBeingPersisted = true;
                if (x.isCurrentUser === true) {
                    reactionType = "delete";
                    x.isCurrentUser = false;
                    x.count--;
                    newReaction = Array.from(newReactions).find(x => x.reaction_id === item.id);
                    const tempRemoval = Array.from(userContentReactions).find(reaction => 
                        ((reaction.user_id === this.currentUserId) && (reaction.reaction_id === item.id))
                    );
                    userContentReactions.delete(tempRemoval);
                    apiPromise = axios.delete(`${this.API_URL}/${newReaction.id}`);
                } else {
                    reactionType = "add";
                    x.isCurrentUser = true;
                    x.count++;
                    const baseObj = {
                        "user_id": this.currentUserId,
                        "content_id" : contentId,
                        "reaction_id": item.id
                    }
                    const tempObj = {
                        ...baseObj,
                        id: Array.from(userContentReactions).length + (Math.random() * 10),
                        isVisible: true,
                        reaction: reactions.find(y => y.id === item.id),
                        user: users.find(u => u.id === this.currentUserId)
                    }
                    userContentReactions.add(tempObj);
                    apiPromise = axios.post(this.API_URL, baseObj);
                }
            }
        });
        this.setState({ contentReactions, userContentReactions });
        this.updateReactionData();
        apiPromise.then(response => {
            Array.from(contentReactions).forEach(item => {
                if (
                    (reactionType === "delete" && item.id === newReaction.reaction_id) ||
                    (reactionType === "add" && item.id === response.data.reaction_id)
                ) {
                    item.isBeingPersisted = false;
                }
            });
            if (reactionType === "delete") {
                newReactions.delete(newReaction);
            } else {
                newReactions.add(response.data);
            }
            this.getUserReactions();
            this.setState({ contentReactions, newReactions });
        }).catch(error => {
            console.log("error in submission", error);
            contentReactions.forEach((x) => {
                if (x.id === tempVariableForReaction.id) {
                    x.isCurrentUser = (reactionType === "delete");
                    x.count = (reactionType === "delete") ? (x.count + 1) : (x.count - 1);
                }
            });
            this.setState({ contentReactions });
            this.updateReactionData();
        })
	}

    handleNavigation = (item) => {
        const { navList } = this.state;
        navList.forEach(nav => {
            nav.isActive = (nav.content === item);
        })
        this.setState( {navList });
    }

    showSummary = () => {
        this.setState({
            shouldShowSummary: true
        });
        this.showOverlay();
    }

    hideSummary = () => {
        this.setState({
            shouldShowSummary: false
        });
    }

    showReactionsList = () => {
        this.setState({
            isTriggered: true
        });
        this.showOverlay();
    }

    hideReactionsList = () => {
        this.setState({
            isTriggered: false
        })
    }

    showOverlay = () => {
        this.setState({
            shouldShowOverlay: true
        });
    }

    hideOverlay = () => {
        this.setState({
            shouldShowOverlay: false
        });
        this.hideSummary();
        this.hideReactionsList();
    }

    filterContent = (emoji) => {
        const { userContentReactions } = this.state;
        userContentReactions.forEach(item => {
            item.isVisible = (emoji === "All") ? true : (item.reaction.emoji === emoji);
        });
        this.setState({ userContentReactions });
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

    updateContentReactions = () => {
        const { reactions } = this.props;
        const { contentReactions, userReactions, newReactions } = this.state;
        if (Array.from(contentReactions).length === 0) {
            reactions.forEach(reaction => {
                const item = {};
                Object.assign(item, reaction);
                const filteredReactions = userReactions.filter(userReaction => (userReaction.reaction_id === reaction.id));
                item.count = filteredReactions.length;
                const currentUserReactions = filteredReactions.filter(item => (item.user_id === this.currentUserId ));
                item.isCurrentUser = (currentUserReactions.length > 0);
                if (item.isCurrentUser) {
                    currentUserReactions.forEach(item => { newReactions.add(item) })
                }
                item.isBeingPersisted = false;
                contentReactions.add(item);
            });
        }
        this.setState({ contentReactions, newReactions });
    }

    updateUserContentReactions = () => {
        const { users, reactions } = this.props;
        const { userReactions } = this.state;
        const userContentReactions = new Set();
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
        this.setState({ userContentReactions });
    }

    updateNavList = () => {
        const { shouldShowSummary, contentReactions } = this.state;
        let { navList } = this.state;
        if (navList.length === 1) {
            const list = Array.from(contentReactions).map(item => {
                return ({
                    content: item.emoji,
                    count: item.count,
                    isActive: false 
                });
            })
            navList = navList.concat(list);
        } else {
            navList.forEach((nav, index) => {
                if (index !== 0) {
                    nav.count = (Array.from(contentReactions).find(item => item.emoji === nav.content)).count;
                }
            })
            if (shouldShowSummary) {
                this.filterContent((navList.find(item => item.isActive === true)).content);
            }
        }
        this.setState({ navList });
    }

    updateReactionData = () => {
        this.updateContentReactions();
        this.updateUserContentReactions();
        this.updateNavList();  
    }

    render() {
        const { isTriggered, shouldShowSummary, shouldShowOverlay, contentReactions, userContentReactions, navList } = this.state;
        const { reactions } = this.props;
        const summary = (
            <Summary
                userContentReactions={userContentReactions}
                navList={navList}
                filterContent={this.filterContent}
                showSummary={this.showSummary}
            />
        );
        const reacted = Array.from(contentReactions).map(item => {
            if(item.count > 0) {
                const classes = "added-reaction" + (item.isCurrentUser ? " current-user" : "") + (item.isBeingPersisted ? " saving": "");
                return (
                    <div
                        key={item.id}
                        className={classes}
                        onClick={() => { if (!item.isBeingPersisted) this.handleReaction(item)}}
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
        const overlay = (
            <Overlay dismissAction={this.hideOverlay} />
        )
        return (
            <div className="yet-another-wrapper">
                {shouldShowOverlay ? overlay : ""}
                <div className={`trigger-and-summary-container${shouldShowOverlay ? " reactive" : ""}`}>
                    { shouldShowSummary ? summary : ""}
                    <div className="trigger-wrapper">
                        {reacted}
                        <div className="trigger-with-reactions">
                            {isTriggered ? (
                                <Reactions
                                    reactions={reactions}
                                    handleReaction={this.handleReaction}
                                />
                            ) : ""
                            }
                            <button
                                className="trigger"
                                onClick={this.showReactionsList}
                            >
                                <img src={trigger} alt="+" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Trigger;