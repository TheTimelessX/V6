const { exec } = require("child_process");

exec("node server/B.js", (err) => {
	console.log(err)
	exec("node server/cooker.js", (err) => {
		console.log(err)
	})
})
