import React, { Fragment, useEffect, useState } from "react";

import EditServer from "./EditServer";
import PickCurrency from "./PickCurrency";

const api = "https://api.exchangerate-api.com/v4/latest/USD";

function ListServers() {
	const [servers, setServers] = useState([]);
	const [counter, setCounter] = useState(0);
	const [currencyRate, setCurrencyRate] = useState(1);

	const updateCurrency = async (currency) => {
		try {
			const res = await fetch(api);
			const data = await res.json();

			const from = data.rates["USD"];
			const to = data.rates[currency];
			setCurrencyRate(to / from);
		} catch (err) {
			console.error(err.message);
		}
	};

	const getServers = async () => {
		try {
			const response = await fetch("/get");
			const data = await response.json();

			setServers(data);
		} catch (err) {
			console.error(err.message);
		}
	};

	const deleteServer = async (id) => {
		if (window.confirm("Are you sure?") === true) {
			try {
				const response = await fetch("/delete/" + id, {
					method: "DELETE",
				});

				setServers(servers.filter((server) => server._id !== id));
			} catch (err) {
				console.error(err.message);
			}
		}
	};

	const toggleServer = async (server) => {
		try {
			const body = {
				_IsRunning: !server._isrunning,
			};
			const res = await fetch("/toggle/" + server._id, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			window.location = "/";
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		getServers();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setCounter((c) => c + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<Fragment>
			<table className="table mt-5 text-center">
				<thead>
					<tr>
						<th>Name</th>
						<th>IP</th>
						<th>Time Running</th>
						<th>Type</th>
						<th>Price So Far</th>

						<th>Toggle</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{servers.map((server) => (
						<tr
							key={server._id}
							className={
								server._isrunning ? "bg-success text-white" : "bg-light"
							}
						>
							<td>{server._name}</td>
							<td>{server._ip}</td>
							<td>
								{(((server._timerunning.minutes
									? server._timerunning.minutes
									: 0) *
									60 +
									(server._timerunning.seconds
										? server._timerunning.seconds
										: 0) +
									counter * server._isrunning) /
									3600) |
									0}
								:
								{(((server._timerunning.minutes
									? server._timerunning.minutes
									: 0) *
									60 +
									(server._timerunning.seconds
										? server._timerunning.seconds
										: 0) +
									counter * server._isrunning) /
									60) |
									0}
								:
								{((server._timerunning.minutes
									? server._timerunning.minutes
									: 0) *
									60 +
									(server._timerunning.seconds
										? server._timerunning.seconds
										: 0) +
									counter * server._isrunning) %
									60 |
									0}
							</td>
							<td>{server._title}</td>
							<td>
								{(
									((server._timerunning.minutes
										? server._timerunning.minutes
										: 0) *
										server._ppm +
										(server._timerunning.seconds
											? server._timerunning.seconds
											: 0) *
											(server._ppm / 60) +
										counter * server._isrunning * (server._ppm / 60)) *
									currencyRate
								).toFixed(4)}
							</td>

							<td>
								<button
									id="toggle"
									className="btn btn-warning"
									onClick={() => toggleServer(server)}
								>
									{server._isrunning ? "Turn Off" : "Turn On"}
								</button>
							</td>
							<td>
								<EditServer server={server} />
							</td>
							<td>
								<button
									id="delete"
									className="btn btn-danger"
									onClick={() => deleteServer(server._id)}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<PickCurrency setCurrency={updateCurrency} />
		</Fragment>
	);
}

export default ListServers;
