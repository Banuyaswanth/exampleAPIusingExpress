const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

let dbpath = path.join(__dirname, "goodreads.db");
let db = null;

const initialiseDbandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started at http://localhost:3000/");
    });
  } catch (err) {
    console.log(`DB Error: ${err.message}`);
    process.exit(1);
  }
};
initialiseDbandServer();

app.get("/books/", async (request, response) => {
  let getbooksquery = `select * from book
    order by book_id;`;
  let booksarray = await db.all(getbooksquery);
  response.send(booksarray);
});
