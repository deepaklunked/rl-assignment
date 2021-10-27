import React, { Component } from "react";
import "./content.css";
import Trigger from "../trigger/trigger";

class Content extends Component {
    render() {
        const { id, users, reactions } = this.props;
        return (
            <div className="content-wrapper">
                <div className="content">
                    <span>Content {id}</span>
                    <Trigger
                        contentId={id}
                        reactions={reactions}
                        users={users}
                    />
                </div>
            </div>
        )
    }
}

export default Content;