import React, { Component } from "react";
import "./summary.css";

const Title = (props) => {
    return <div className="title">{props.content}</div>
}

class Summary extends Component {
    render() {
        const { userContentReactions, navList, showSummary, filterContent } = this.props;
        const navbar = navList.map((item, index) => {
            if (item.content !== "All" && item.count === 0) {
                return "";
            }
            const classes = "nav-item" + (item.isActive ? " active" : "");
            return (
                <div
                    key={index}
                    className={classes}
                    onClick={() => filterContent(item.content)}
                >
                    {index === 0 ? item.content : (item.content + " · " + item.count)}
                </div>
            )
        });
        const details = Array.from(userContentReactions).map(item => {
            if (item.isVisible) {
                return (
                    <div
                        key={item.id}
                        className="user-reaction"
                    >
                        <img src={item.user.avatar} alt={item.user_id} />
                        <span className="emoji">{item.reaction.emoji}</span>
                        {item.user.fullName}   
                    </div>
                )
            } else {
                return "";
            }
        })

        return <div className="summary" onMouseEnter={showSummary}>
            <Title content="Reactions" />
            <div className="nav-list">
                {navbar}
            </div>
            <div className="user-reactions">
                {details}
            </div>
        </div>
    }
}

export default Summary;