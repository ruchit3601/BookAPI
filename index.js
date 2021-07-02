require("dotenv").config();

const express = require("express");

const  mongoose = require("mongoose");

//database
const database = require("./database");

//model
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");
const { findOne } = require("./database/book");

//initialization
const booky = express();

//establish database connection
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
)
.then(()=>console.log("CONNECTION ESTABLISHED!!!!"));


//configuration
booky.use(express.json());
console.log(process.env.MONGO_URL);

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/", async (req,res) =>{
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route           /is
Description     Get specific books based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn", async (req,res) =>{
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn}); 
    //value -> true

    if(!getSpecificBook){
        return res.json({
            error: `no book found for the ISBN of ${req.params.isbn}`,
        });
    }
    return res.json({book: getSpecificBook});
});

/*
Route           /c
Description     Get specific books based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/

booky.get("/c/:category",async (req,res) =>{
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });

    if(!getSpecificBooks){
        return res.json({
            error: `No book found for the category of ${req.params.category}`,

        }); 
    }
    return res.json({book: getSpecificBooks});
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

booky.get("/author", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({authors: getAllAuthors});

});

/*
Route           /author/:name
Description     Get specific author based by name
Access          PUBLIC
Parameter       name
Methods         GET
*/
booky.get("/author/:name", async (req,res) =>{
    const getSpecificAuthors = await AuthorModel.findOne({
        name: req.params.name,
    });
    
    if(!getSpecificAuthors){
        return res.json({
            error: `No auther found for the name of ${req.params.name}`,
        });
    }
    return res.json({authors: getSpecificAuthors})
});

/*
Route           /author/book
Description     get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/author/:isbn", async (req,res) => {
     const getSpecificAuthors = await AuthorModel.findOne({
        ISBN: req.params.isbn,
     });
    // const getSpecificAuthor = database.author.filter(
    //     (author) => author.books.includes(req.params.isbn)
    // );
    if(!getSpecificAuthors){
        return res.json({
            error: `No Author found for the book of ${req.params.isbn}`,

        });
    }
    return res.json({authors: getSpecificAuthors});
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/publications", async (req, res) => {
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

booky.post("/book/add", async (req,res) =>{
    const {newBook} = req.body;
    BookModel.create(newBook);    
    return res.json({ message: "book was added"});
});


//API
/*
Route            /author/add
Description      add new author
Access           PUBLIC
Parameter        NONE
Methods          POST
 */

booky.post("/author/add", async (req,res) =>{
    const{newAuthor} = req.body;
    AuthorModel.create(newAuthor);
    return res.json({ message: "author was added"});
});

//API
/*
Route            /publication/add
Description      add new publication
Access           PUBLIC
Parameter        NONE
Methods          POST
 */
booky.post("/publication/add", async (req,res) =>{
    const{newPublication} = req.body;
    PublicationModel.create(newPublication);
    return res.json({message: "publication was added"});
});

//API
/*
Route            /book/update/title
Description      update book titile
Access           PUBLIC
Parameter        isbn
Methods          PUT
 */

booky.put("/book/update/:isbn", async (req,res) =>{
    const updatedBook = await BookModel.findOneAndUpdate(
        {
          ISBN: req.params.isbn,
        },
        {
          title: req.body.bookTitle,
        },
        {
          new: true, // to get updated data
        }
      );
    
      // database.books.forEach((book) => {
      //   if (book.ISBN === req.params.isbn) {
      //     book.title = req.body.bookTitle;
      //     return;
      //   }
      // });
    
      return res.json({ books: updatedBook });
    });
    

/*
Route            /book/update/author
Description      Update/add new author
Access           PUBLIC
Parameter        isbn
Methods          PUT
 */
booky.put("/book/author/update/:isbn", async (req,res) =>{
    //update the book database
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $addToSet:{
                authors: req.body.newAuthor,
            },
        },
        {
            new: true,
        }
    );
    
  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn)
  //     return book.authors.push(req.body.newAuthor);
  // });

  // update the author database
  const updateAuthor = await AuthorModel.findOneAndUpdate(
      {
         id: req.body.newAuthor, 
      },
      {
          $addToSet:{
              books: req.params.isbn,
          },
      },
      {
          new: true,
      }
  );
   // database.authors.forEach((author) => {
  //   if (author.id === req.body.newAuthor)
  //     return author.books.push(req.params.isbn);
  // });
      return res.json({books: updateBook, authors: updateAuthor, message: "New author was added 🚀", });
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

//API
/*
Route            /publication/update/book
Description      Update/add new book to a publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
 */

booky.put("/publication/update/book/:isbn",(req,res) => {
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
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
 */
booky.delete("/book/delete/:isbn", async(req,res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete({
        ISBN: req.params.isbn,
    });
    // const updatedBookDatabase = database.books.filter((book) => book.ISBN != req.params.isbn
    // );
    // database.books = updatedBookDatabase;
    return res.json({books: database.books});
});

//API
/*
Route            /book/delete/author
Description      Delete a author from a book
Access           PUBLIC
Parameter        isbn,author id
Methods          DELETE
 */
booky.delete("/book/delete/author/:isbn/:authorId", async(req,res) => {
    
    //update the Book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $pull:{
                authors: PageTransitionEvent(req.params.authorId),
            },
        },
        {
            new: true,
        },
    );
   
    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId),
        },
        {
            $pull:{
                books: req.params.isbn,
            },
        },
        {
            new: true,
        },
    );

    return res.json({
        messsage: "author was deleted!!!!!!😪",
        book: updatedBook,
        author: updatedAuthor,
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

booky.delete("/publication/delete/book/:isbn/:pubId",(req,res) => {
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





booky.listen(2000,() => console.log("hey server is running"));