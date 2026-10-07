
const axios = require("axios");
const BASE_URL = "http://localhost:3000";
async function getAllBooks(){try{const response=await axios.get(`${BASE_URL}/`);console.log("All Books:");console.log(response.data);return response.data;}catch(error){console.error("Error:",error.message);}}
async function getBookByISBN(isbn){try{const response=await axios.get(`${BASE_URL}/isbn/${isbn}`);console.log("Book by ISBN:");console.log(response.data);return response.data;}catch(error){console.error("Error:",error.message);}}
async function getBooksByAuthor(author){try{const response=await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);console.log("Books by Author:");console.log(response.data);return response.data;}catch(error){console.error("Error:",error.message);}}
async function getBooksByTitle(title){try{const response=await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);console.log("Books by Title:");console.log(response.data);return response.data; }catch(error){console.error("Error:",error.message);}}
module.exports={getAllBooks,getBookByISBN,getBooksByAuthor,getBooksByTitle};
