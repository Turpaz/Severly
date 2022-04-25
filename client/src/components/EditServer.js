import React, { Fragment, useState } from "react";

function EditServer({ server }) {
	const [name, setName] = useState(server._name);
	const [ip, setIP] = useState(server._ip);
	const [title, setTitle] = useState(server._title);
	const [ppm, setPPM] = useState(server._ppm);

	const updateServer = async (e) => {
		e.preventDefault();
		try {
			const body = {
				_IP: ip,
				_Name: name,
				_TypeName: title,
				_TypePPM: ppm,
			};
			const res = await fetch("http://localhost:3001/update/" + server._id, {
				method: "PUT",
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
			<button
				type="button"
				class="btn btn-primary"
				data-toggle="modal"
				data-target={`#id${server._id}`}
			>
				Edit
			</button>

			<div
				class="modal"
				id={`id${server._id}`}
				onClick={() => {
					setName(server._name);
					setIP(server._ip);
					setTitle(server._title);
					setPPM(server._ppm);
				}}
			>
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">Edit Server</h4>
							<button
								type="button"
								class="close"
								data-dismiss="modal"
								onClick={() => {
									setName(server._name);
									setIP(server._ip);
									setTitle(server._title);
									setPPM(server._ppm);
								}}
							>
								&times;
							</button>
						</div>

						<div class="modal-body">
							<input
								type="text"
								required
								className="form-control mt-1"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<input
								type="text"
								required
								className="form-control mt-1"
								value={ip}
								onChange={(e) => setIP(e.target.value)}
							/>
							<select
								required
								className="form-control mt-1"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
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
								step={0.01}
								className="form-control mt-1"
								value={ppm}
								onChange={(e) => setPPM(e.target.value)}
							/>
						</div>

						<div class="modal-footer">
							<button
								type="button"
								class="btn btn-primary"
								data-dismiss="modal"
								onClick={(e) => updateServer(e)}
							>
								Edit
							</button>
							<button
								type="button"
								class="btn btn-secondary"
								data-dismiss="modal"
								onClick={() => {
									setName(server._name);
									setIP(server._ip);
									setTitle(server._title);
									setPPM(server._ppm);
								}}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default EditServer;
