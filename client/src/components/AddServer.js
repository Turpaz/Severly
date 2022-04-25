import React, { Fragment, useState } from "react";

function AddServer() {
	const [serverName, setServerName] = useState("");
	const [serverIP, setServerIP] = useState("");
	const [serverTypeName, setServerTypeName] = useState("t1.micro");
	const [serverTypePPM, setServerTypePPM] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(serverName, serverIP, serverTypeName, serverTypePPM);
		try {
			const body = {
				_Name: serverName,
				_IP: serverIP,
				_TypeName: serverTypeName,
				_TypePPM: serverTypePPM,
			};
			const response = await fetch("/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			window.location = "/";
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<Fragment>
			<form className="d-flex mt-5" onSubmit={handleSubmit}>
				<br />
				<input
					type="text"
					required
					placeholder="Server Name"
					className="form-control mr-2"
					value={serverName}
					onChange={(e) => setServerName(e.target.value)}
				/>
				<input
					type="text"
					required
					placeholder="Server IP"
					className="form-control mr-2"
					value={serverIP}
					onChange={(e) => setServerIP(e.target.value)}
				/>
				<select
					required
					className="form-control mr-2"
					defaultValue={serverTypeName}
					onChange={(e) => setServerTypeName(e.target.value)}
				>
					<option value="t1.micro">t1.micro</option>
					<option value="t1.nano">t1.nano</option>
					<option value="t1.xl">t1.xl</option>
					<option value="t2.xxl">t2.xxl</option>
				</select>
				<input
					type="number"
					required
					min={0}
					step={0.0001}
					placeholder="Server Price Per Minute"
					className="form-control mr-2"
					value={serverTypePPM}
					onChange={(e) => setServerTypePPM(e.target.value)}
				/>
				<button className="btn btn-success">Add</button>
			</form>
		</Fragment>
	);
}

export default AddServer;
