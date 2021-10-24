import React, { Component } from "react";
import "./navbar.css";

class Navbar extends Component {
    initialState = {
        navList: [{
            content: 'All',
            isActive: true
        }]
    }

    state = this.initialState;

    componentDidMount() {
        const { contentReactions } = this.props;
        const { navList } = this.state;
        const list = Array.from(contentReactions).map(item => {
            return ({
                content: `${item.emoji} · ${item.count}`,
                isActive: false 
            });
        })
        this.setState({ navList: navList.concat(list) });
    }

    handleClick(item) {
        const { navList } = this.state;
        navList.forEach(nav => {
            nav.isActive = (nav.content === item.content);
        })
        this.setState( {navList });
        this.props.filterContent(item.content.split(" ")[0]);
    }

    render() {
        const { navList } = this.state;
        const list = navList.map((item, index) => {
            const classes = "nav-item" + (item.isActive ? " active" : "");
            return (
                <div
                    key={index}
                    className={classes}
                    onClick={() => this.handleClick(item)}
                >
                    {item.content}
                </div>
            )
        });
        return list;
    }
}

export default Navbar;