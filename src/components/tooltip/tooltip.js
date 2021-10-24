import React from "react";
import "./tooltip.css";

const tooltip = (props) => {
    return(
        <div className="tooltip">
            {props.content}
        </div>
    )
}

export default tooltip;