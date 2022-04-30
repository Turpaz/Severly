const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");

const PORT = process.nextTick.PORT || 3001;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/build")));
}

// ---===+++<<< -ROUTES- >>>+++===---

// add
app.post("/add", async (req, res) => {
	try {
		const { _IP, _Name, _TypeName, _TypePPM } = req.body;
		const newServer = await pool.query(
			"INSERT INTO servers (_IP, _Name, _Type, _IsRunning, _TimeRunning, _LastActionTime) VALUES ($1, $2, ($3, $4), $5, $6, now()) RETURNING *",
			[_IP, _Name, _TypeName, _TypePPM, false, 0]
		);
		res.json(newServer.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
});

// update
app.put("/update/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { _IP, _Name, _TypeName, _TypePPM } = req.body;
		const updatedServer = await pool.query(
			"UPDATE servers SET _IP = $1, _Name = $2, _Type = ($3, $4) WHERE _ID = $5 RETURNING *",
			[_IP, _Name, _TypeName, _TypePPM, id]
		);
		res.json(updatedServer.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
});

// toggle
app.put("/toggle/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { _IsRunning } = req.body;
		const updatedServer = await pool.query(
			"UPDATE servers SET _IsRunning = $1 WHERE _ID = $2 RETURNING *",
			[_IsRunning, id]
		);

		// update _lastActionTime and _timeRunning
		const updatedUpdateServer = await pool.query(
			"UPDATE servers SET _TimeRunning = CASE WHEN _IsRunning THEN (_TimeRunning) ELSE (_TimeRunning + (now() - _LastActionTime)) END, _LastActionTime = now()\
			WHERE _ID = $1 RETURNING *",
			[id]
		);
		res.json(updatedUpdateServer.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
});

// delete
app.delete("/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deletedServer = await pool.query(
			"DELETE FROM servers WHERE _ID = $1 RETURNING *",
			[id]
		);
		res.json(deletedServer.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
});

// get all
app.get("/get", async (req, res) => {
	try {
		const servers = await pool.query(
			"SELECT _id, _ip, _name, (_type)._title, (_type)._ppm, _isrunning, CASE WHEN (_isrunning) THEN (_timerunning + (now() - _lastactiontime)) ELSE (_timerunning) END AS _timerunning, _lastactiontime FROM servers"
		);
		res.json(servers.rows);
	} catch (err) {
		console.error(err.message);
	}
});

// get one
app.get("/get/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const server = await pool.query(
			"SELECT _id, _ip, _name, (_type)._title, (_type)._ppm, _isrunning, CASE WHEN (_isrunning) THEN (_timerunning + (now() - _lastactiontime)) ELSE (_timerunning) END AS _timerunning, _lastactiontime FROM servers WHERE _ID = $1",
			[id]
		);
		res.json(server.rows);
	} catch (err) {
		console.error(err.message);
	}
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname + "./client/build/index.html"));
});

// ---===+++<<< -END- >>>+++===---

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
