import React, { Fragment } from "react";
import "./App.css";
// Components
import AddServer from "./components/AddServer";
import ListServers from "./components/ListServers";

function App() {
	return (
		<Fragment>
			<div id="background">
				<div className="container h-100" id="content">
					<h1 className="text-center mt-3">Servers Manager</h1>
					<AddServer />
					<ListServers />
				</div>
			</div>
		</Fragment>
	);
}

export default App;
