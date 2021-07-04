//Initializing Exxpress Router
const Router = require("express").Router();

//Database Models
const BookModel = require("../../database/book");

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
Router.get("/", async (req,res) =>{
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
Router.get("/is/:isbn", async (req,res) =>{
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

Router.get("/c/:category",async (req,res) =>{
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
Router.get("/l/:language",(req,res) =>{
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
Route            /book/add
Description      add new book
Access           PUBLIC
Parameter        NONE
Methods          POST
 */

Router.post("/add", async (req,res) =>{
    const {newBook} = req.body;
    BookModel.create(newBook);    
    return res.json({ message: "book was added"});
});


//API
/*
Route            /book/update/title
Description      update book titile
Access           PUBLIC
Parameter        isbn
Methods          PUT
 */

Router.put("/update/:isbn", async (req,res) =>{
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
Router.put("/author/update/:isbn", async (req,res) =>{
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
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
 */
Router.delete("/delete/:isbn", async(req,res) => {
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
Router.delete("/delete/author/:isbn/:authorId", async(req,res) => {
    
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


module.exports = Router;