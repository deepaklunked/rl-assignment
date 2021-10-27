import React, { Component } from "react";
import "./overlay.css";

class Overlay extends Component {
    render() {
        return (
            <div
                className="overlay"
                onClick={() => { this.props.dismissAction() }}
            ></div>
        )
    }
}

export default Overlay;