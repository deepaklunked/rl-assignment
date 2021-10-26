import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Content from "./components/content/content";

export const BASE_URL = "https://artful-iudex.herokuapp.com";

class App extends Component {
	initialState = {
		reactions: null,
		users: null,
        content: [1, 2] // assuming there are only two types of content
	}

	state = this.initialState;

	async componentDidMount() {
        axios.get(`${BASE_URL}/reactions`).then((response) => {
			this.setState({
				reactions: response.data
			})
		})
		axios.get(`${BASE_URL}/users`).then((response) => {
			this.setState({
				users: response.data
			})
		})
	}

	render() {
		const { users, reactions } = this.state;
        const content = this.state.content.map((id) => {
            return (
                <div key={id}>
                    <span>Content {id}</span>
                    <Content
                        id={id}
                        users={users}
                        reactions={reactions}
                    />
                </div>
            )
        });
        const showElements = (users && reactions)
		return (
			<div className="App">
                { showElements ? content : "Loading.." }
			</div>
		);
	}
}

export default App;
