const { author } = require("../../database");

const Router = require("express").Router();

const AuthorModel = require("../../database/author");
//relative path

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

Router.get("/", async (req,res) => {
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
Router.get("/:name", async (req,res) =>{
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
Router.get("/:isbn", async (req,res) => {
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

//API
/*
Route            /author/add
Description      add new author
Access           PUBLIC
Parameter        NONE
Methods          POST
 */

Router.post("/add", async (req,res) =>{
    const{newAuthor} = req.body;
    AuthorModel.create(newAuthor);
    return res.json({ message: "author was added"});
});

//API
/*
Route            /author/update/name
Description      Update author name
Access           PUBLIC
Parameter        id
Methods          PUT
 */

Router.put("/update/name/:id", (req,res) =>{

    database.author.forEach((author) =>{
        if(author.id===parseInt(req.params.id))
        {
            author.name = req.body.newAuthorName;
            return;
        }
    });

    return res.json({authors:database.author});

});

module.exports = Router;