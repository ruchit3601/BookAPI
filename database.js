let books = [{
    ISBN: "12345Book",
    title: "Getting started with MERN",
    pubDate: "2021-01-07",
    language: "en",
    numPage: 250,
    author: [1,2],
    publications: [1],
    category: ["tect","programing","education","thriller"],
},
{
    ISBN: "12345Boook",
    title: "Getting started with MN",
    pubDate: "2021-01-07",
    language: "en",
    numPage: 250,
    author: [1,2],
    publications: [1],
    category: ["tect","programing","education","thriller"],
},
];

const author = [
    {
      id: 1,
      name: "ruchit",
      books: ["12345Boook", "123456789Secret"],  
    },
    {
        id: 2,
        name: "Elon MUSK",
        books: ["12345Boook"],
    },
];

const publication = [
    {
        id: 1,
        names: "writerx",
        books: ["12345Boook"],
    },
    {
        id: 3,
        names: "dogy",
        books: [],
    },
];




module.exports = {books, author, publication};