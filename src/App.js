import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Content from "./components/content/content";

export const BASE_URL = "https://artful-iudex.herokuapp.com";

class App extends Component {
	initialState = {
		reactions: null,
		users: null,
		userReactions: null,
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
		axios.get(`${BASE_URL}/user_content_reactions`).then((response) => {
			this.setState({
				userReactions: response.data
			})
		})  
	}

	render() {
		const { users, reactions, userReactions } = this.state;
        const content = this.state.content.map((id) => {
            return <Content
                key={id}
                id={id}
                users={users}
                reactions={reactions}
                userReactions={userReactions}
            />
        });
        const showElements = (users && reactions && userReactions)
		return (
			<div className="App">
                { showElements ? content : "Loading.." }
			</div>
		);
	}
}

export default App;
