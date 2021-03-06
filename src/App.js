import React from "react";
import { Helmet } from "react-helmet";
import "./App.css";
import Typeform from "./components/forms/Typeform";
import Error from "./components/Error";
import firebase from "./firebase";
import config from "./config";
import GoogleForms from "./components/forms/GoogleForms";
import Admin from "./components/admin/Admin";
import OtherForm from "./components/forms/OtherForm";
import Airtable from "./components/forms/Airtable";
import SurveyMonkey from "./components/forms/SurveyMonkey";

class App extends React.Component {
	constructor(props) {
		super(props);

		document.title = config.entityName + " Forms";
		this.state = { loading: true, admin: false, home: false, error: false };
	}

	componentDidMount() {
		var path = window.location.pathname.substring(1);

		if (path === "admin") {
			this.setState({ loading: false, admin: true });
		} else if (path === "") {
			this.setState({ loading: false, home: true });
		} else {
			firebase
				.database()
				.ref("urls")
				.once("value")
				.then(
					function (snapshot) {
						for (var pushKey in snapshot.val()) {
							var entry = snapshot.val()[pushKey];
							if (entry.short === path) {
								this.setState({
									loading: false,
									admin: false,
									type: entry.type,
									url: entry.full,
								});
								return;
							}
						}

						this.setState({
							loading: false,
							error: true,
						});
					}.bind(this)
				);
		}
	}

	render() {
		return (
			<>
				<Helmet>
					<title>{config.entityName} Forms</title>
				</Helmet>

				{this.state.error ? (
					<Error />
				) : (
					<>
						{this.state.loading ? (
							<></>
						) : (
							<>
								{this.state.admin ? (
									<>
										<Admin />
									</>
								) : this.state.home ? (
									window.location.replace(config.homeRedirect)
								) : (
									<>
										{this.state.type === "typeform" ? (
											<Typeform src={this.state.url} />
										) : this.state.type === "googleforms" ? (
											<GoogleForms src={this.state.url} />
										) : this.state.type === "airtable" ? (
											<Airtable src={this.state.url} />
										) : this.state.type === "surveymonkey" ? (
											<SurveyMonkey src={this.state.url} />
										) : (
											<OtherForm src={this.state.url} />
										)}
									</>
								)}
							</>
						)}
					</>
				)}
			</>
		);
	}
}

export default App;
