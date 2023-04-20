const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

let dbpath = path.join(__dirname, "goodreads.db");
let db = null;

//Initializing the server and connecting to the database
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

//get books api
app.get("/books/", async (request, response) => {
  let getbooksquery = `select * from book
    order by book_id;`;
  let booksarray = await db.all(getbooksquery);
  response.send(booksarray);
});

//get a particular book api

app.get("/books/:bookid/", async (request, response) => {
  const { bookid } = request.params;
  const getbookquery = `select * from book 
                            where book_id = ${bookid};`;
  let book = await db.get(getbookquery);
  response.send(book);
});
