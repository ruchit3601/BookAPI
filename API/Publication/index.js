const Router = require("express").Router();

const PublicationModel = require("../../database/publication");
/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
Router.get("/", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({ publications: getAllPublications });
  });
  
/*
Route           /publications/id/:pid
Description     get specific publications 
Access          PUBLIC
Parameter       pid
Methods         GET
*/
Router.get("/id/:pid",(req,res) =>{
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
Router.get("/books/:isbn", (req,res) => {
    const getSpecificPublications = database.publication.filter((publication) =>
    publication.books.includes(req.params.isbn));

    if(getSpecificPublications.length===0)
    {
        return res.json({error:`No publications found based on ${req.params.isbn}`});
    }

    return res.json({publications:getSpecificPublications});
});

//API
/*
Route            /publication/add
Description      add new publication
Access           PUBLIC
Parameter        NONE
Methods          POST
 */
Router.post("/add", async (req,res) =>{
    const{newPublication} = req.body;
    PublicationModel.create(newPublication);
    return res.json({message: "publication was added"});
});


//API
/*
Route            /publication/update/name
Description      Update the publication's name
Access           PUBLIC
Parameter        id
Methods          PUT
 */

Router.put("/update/name/:id", (req,res) =>{

    database.publication.forEach((publication) =>{
        if(publication.id===parseInt(req.params.id))
        {
            publication.name = req.body.newPublicationName;
            return;
        }
    });

    return res.json({publications:database.publication});
});

//API
/*
Route            /publication/update/book
Description      Update/add new book to a publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
 */

Router.put("/update/book/:isbn",(req,res) => {
    //update the publication database
    database.publications.forEach((publication) => {
        if(publication.id === req.body.pubID){
           return publication.book.push(req.params.isbn);
        }
    });
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
        
    });
    return res.json({books: database.books, publications: database.publications, message: "sucessfuly updated publication",
});
});

//API
/*
Route            /publication/delete/book
Description      Delete a book from publication
Access           PUBLIC
Parameter        isbn,publication id
Methods          DELETE
 */

Router.delete("/delete/book/:isbn/:pubId",(req,res) => {
    //update publication database
    database.getSpecificPublications.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)){
            const newBooksList = publication.books.filter((book) => book !== req.params.isbn
            );
            publication.books = newBooksList;
            return;
        }
    });
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication =0; // no publication available
            return;
        }
    });
    return res.json({books: database.books, publications: database.publications,});
});

module.exports = Router;