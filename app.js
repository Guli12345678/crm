// CRM loyihasida Lid, Student va Paymen tablelari uchun Foreign keylari bilan CRUD yozish
// lid_status, reason, role va branch tablelariga CRUD yozish

const express = require("express");
const config = require("config");
const PORT = config.get("port");
const indexRouter = require("./routes/index");
const app = express();

app.use(express.json());
app.use("/api", indexRouter);

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Err: ", error);
  }
}
start();
