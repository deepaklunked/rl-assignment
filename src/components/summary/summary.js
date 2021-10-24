import React, { Component } from "react";
import "./summary.css";
import Navbar from "../navbar/navbar";

const Title = (props) => {
    return <div className="title">{props.content}</div>
}

class Summary extends Component {
    initialState = {
        userContentReactions: []
    }

    state = this.initialState
    
    componentDidMount() {
        console.log("summary componentDidMount");
        // const userContentReactions = Array.from(this.props.userContentReactions);
        // const list =userContentReactions.map(item => {
        //     item.isVisible = true;
        //     item.user.fullName = `${item.user.first_name} ${item.user.last_name}`
        //     return item;
        // })
        // this.setState({ userContentReactions: list });
        this.setState({
            userContentReactions: this.props.userContentReactions
        })
    }

    filterContent = (emoji) => {
        const { userContentReactions } = this.state;
        userContentReactions.forEach(item => {
            item.isVisible = (emoji === "All") ? true : (item.reaction.emoji === emoji);
        })
        this.setState({ userContentReactions });
    }

    render() {
        console.log("summary render");
        const { contentReactions } = this.props;
        const { userContentReactions } = this.state;
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

        return <div className="summary">
            <Title content="Reactions" />
            <div className="nav-list">
                <Navbar
                    contentReactions={contentReactions}
                    filterContent={this.filterContent}
                />
            </div>
            <div className="user-reactions">
                {details}
            </div>
        </div>
    }
}

export default Summary;