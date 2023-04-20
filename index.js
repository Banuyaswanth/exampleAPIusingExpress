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

//Add Book API
app.post("/books/", async (request, response) => {
  let bookDetails = request.body();
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const addBookQuery = `INSERT INTO book 
    (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    values ('${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}');`;
  let dbresponse = await db.run(addBookQuery);
  let bookid = dbresponse.lastID;
  response.send({ bookid: bookid });
});
