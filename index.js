const express = require("express");
const { get } = require("http");

//database
const database = require("./database");

//initialization
const booky = express();

//configuration
booky.use(express.json());

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/",(req,res) =>{
    return res.json({books: database.books});
});

/*
Route           /is
Description     Get specific books based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn",(req,res) =>{
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );
    if(getSpecificBook.length === 0){
        return res.json({
            error: `no book found for the ISBN of ${req.param.isbn}`,
        });
    }
    return res.json({book: getSpecificBook})
});

/*
Route           /c
Description     Get specific books based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/

booky.get("/c/:category",(req,res) =>{
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );
    if(getSpecificBook.length === 0){
        return res.json({
            error: `No book found for the category of ${req.params.category}`,

        });
        
    }
    return res.json({book: getSpecificBook})
});
/*
Route           /l
Description     Get specific books based on language
Access          PUBLIC
Parameter       language
Methods         GET
*/
booky.get("/l/:language",(req,res) =>{
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );
    if(getSpecificBook.length === 0){
        return res.json({
        error: `No book found for the language of ${req.params.language}`,
    });
    }
    return res.json({book: getSpecificBook})
});

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

booky.get("/author",(req,res) => {
    return res.json({authors: database.author});

});

/*
Route           /author/:name
Description     Get specific author based by name
Access          PUBLIC
Parameter       name
Methods         GET
*/
booky.get("/author/:name",(req,res) =>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.name.includes(req.params.name)
    );
    if(getSpecificAuthor.length === 0){
        return res.json({
            error: `No auther found for the name of ${req.params.name}`,
        });
    }
    return res.json({authors: getSpecificAuthor})
});

/*
Route           /author/book
Description     get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/author/book/:isbn",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length === 0){
        return res.json({
            error: `No Author found for the book of ${req.params.isbn}`,

        });
    }
    return res.json({authors: getSpecificAuthor});
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/publications", (req, res) => {
    return res.json({ publications: database.publication });
  });
  
/*
Route           /publications/id/:pid
Description     get specific publications 
Access          PUBLIC
Parameter       pid
Methods         GET
*/
booky.get("/publications/id/:pid",(req,res) =>{
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id===parseInt(req.params.pid)
    );
    if(getSpecificPublication.length === 0){
        return res.json({
            error: `No publication found for the name of ${req.params.pid}`,
        });
    }
    return res.json({publications: getSpecificPublication})
});

/*
Route            /publication/books
Description      Get specific publications based on isbn
Access           PUBLIC
Parameter        isbn
Methods          GET
 */
booky.get("/publications/books/:isbn", (req,res) => {
    const getSpecificPublications = database.publication.filter((publication) =>
    publication.books.includes(req.params.isbn));

    if(getSpecificPublications.length===0)
    {
        return res.json({error:`No publications found based on ${req.params.isbn}`});
    }

    return res.json({publications:getSpecificPublications});
});

/*
Route            /book/add
Description      add new book
Access           PUBLIC
Parameter        NONE
Methods          POST
 */

booky.post("/book/add",(req,res) =>{
    const {newBook} = req.body;
    database.books.push(newBook);

    return res.json({books:database.books});
});


//API
/*
Route            /author/add
Description      add new author
Access           PUBLIC
Parameter        NONE
Methods          POST
 */

booky.post("/author/add",(req,res) =>{
    const{newAuthor} = req.body;
    database.author.push(newAuthor);

    return res.json({authors:database.author});
});

//API
/*
Route            /publication/add
Description      add new author
Access           PUBLIC
Parameter        NONE
Methods          POST
 */
booky.post("/publication/add",(req,res) =>{
    const{newPublication} = req.body;
    database.publication.push(newPublication);

    return res.json({publications: database.publication});
});

//API
/*
Route            /book/update/title
Description      update book titile
Access           PUBLIC
Parameter        isbn
Methods          PUT
 */

booky.put("/book/update/title/:isbn",(req,res) =>{
    database.books.forEach((book) =>{
        if(book.ISBN===req.params.ISBN){
            book.title = req.body.newBookTitle;
            return;
        }
    });
    res.json({books: database.books});
});

/*
Route            /book/update/author
Description      Update/add new author
Access           PUBLIC
Parameter        isbn
Methods          PUT
 */
booky.put("/book/update/author/:isbn/:authorId",(req,res) =>{
    //updating book database
    database.books.forEach(
        (book)=> {
            if(book.isbn===req.params.isbn){
                return book.author.push(parseInt(req.params.authorId));
            }
        });
        //updating author database
        database.author.forEach((author)=>{
            if(author.id===parseInt(req.params.authorId))
            {
                return author.books.push(req.params.isbn);
            }
        });
        return res.json({books:database.books, author:database.author});
});

//API
/*
Route            /author/update/name
Description      Update author name
Access           PUBLIC
Parameter        id
Methods          PUT
 */

booky.put("/author/update/name/:id", (req,res) =>{

    database.author.forEach((author) =>{
        if(author.id===parseInt(req.params.id))
        {
            author.name = req.body.newAuthorName;
            return;
        }
    });

    return res.json({authors:database.author});

});

//API
/*
Route            /publication/update/name
Description      Update the publication's name
Access           PUBLIC
Parameter        id
Methods          PUT
 */

booky.put("/publication/update/name/:id", (req,res) =>{

    database.publication.forEach((publication) =>{
        if(publication.id===parseInt(req.params.id))
        {
            publication.name = req.body.newPublicationName;
            return;
        }
    });

    return res.json({publications:database.publication});

});

booky.listen(2000,() => console.log("hey server is running"));