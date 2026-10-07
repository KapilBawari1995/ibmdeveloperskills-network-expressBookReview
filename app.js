const express = require("express");
const session = require("express-session");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const books = require("./books.json");
const users = require("./users.json");
const app = express();
app.use(express.json());
app.use(session({ secret: "book-review-session-secret", resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 1000 } }));
const JWT_SECRET = "book-review-jwt-secret";
function saveUsers(){fs.writeFileSync("./users.json",JSON.stringify(users,null,2));}
function findBook(isbn){return books.find(book=>book.isbn===isbn);}
app.get("/",(req,res)=>res.json(books));
app.get("/isbn/:isbn",(req,res)=>{const book=findBook(req.params.isbn);if(!book)return res.status(404).json({message:"Book not found"});res.json(book);});
app.get("/author/:author",(req,res)=>{const author=req.params.author.toLowerCase();const result=books.filter(book=>book.author.toLowerCase().includes(author));if(!result.length)return res.status(404).json({message:"No books found for this author"});res.json(result);});
app.get("/title/:title",(req,res)=>{const title=req.params.title.toLowerCase();const result=books.filter(book=>book.title.toLowerCase().includes(title));if(!result.length)return res.status(404).json({message:"No books found for this title"});res.json(result);});
app.get("/review/:isbn",(req,res)=>{const book=findBook(req.params.isbn);if(!book)return res.status(404).json({message:"Book not found"});res.json(book.reviews);});
app.post("/register",async(req,res)=>{try{const{username,password}=req.body;if(!username||!password)return res.status(400).json({message:"Username and password are required"});if(users.find(user=>user.username===username))return res.status(409).json({message:"User already exists"});const hashedPassword=await bcrypt.hash(password,10);users.push({username,password:hashedPassword});saveUsers();res.status(201).json({message:"User registered successfully"});}catch{res.status(500).json({message:"Registration failed"});}});
app.post("/login",async(req,res)=>{try{const{username,password}=req.body;const user=users.find(user=>user.username===username);if(!user)return res.status(401).json({message:"Invalid username or password"});const passwordMatch=await bcrypt.compare(password,user.password);if(!passwordMatch)return res.status(401).json({message:"Invalid username or password"});req.session.username=username;const token=jwt.sign({username},JWT_SECRET,{expiresIn:"1h"});res.json({message:"Login successful",username,token});}catch{res.status(500).json({message:"Login failed"});}});
function authenticateJWT(req,res,next){const authHeader=req.headers.authorization;if(!authHeader)return res.status(401).json({message:"Authorization token required"});const token=authHeader.split(" ")[1];if(!token)return res.status(401).json({message:"Invalid authorization format"});jwt.verify(token,JWT_SECRET,(error,decoded)=>{if(error)return res.status(403).json({message:"Invalid or expired token"});req.user=decoded;next();});}
app.post("/review/:isbn",authenticateJWT,(req,res)=>{const book=findBook(req.params.isbn);if(!book)return res.status(404).json({message:"Book not found"});const{review}=req.body;if(!review)return res.status(400).json({message:"Review is required"});book.reviews[req.user.username]=review;res.status(201).json({message:"Review added successfully",isbn:book.isbn,reviews:book.reviews});});
app.put("/review/:isbn",authenticateJWT,(req,res)=>{const book=findBook(req.params.isbn);if(!book)return res.status(404).json({message:"Book not found"});const{review}=req.body;if(!review)return res.status(400).json({message:"Review is required"});if(!book.reviews[req.user.username])return res.status(403).json({message:"You can modify only your own review"});book.reviews[req.user.username]=review;res.json({message:"Review updated successfully",isbn:book.isbn,reviews:book.reviews});});
app.delete("/review/:isbn",authenticateJWT,(req,res)=>{const book=findBook(req.params.isbn);if(!book)return res.status(404).json({message:"Book not found"});if(!book.reviews[req.user.username])return res.status(403).json({message:"You can delete only your own review"});delete book.reviews[req.user.username];res.json({message:"Review deleted successfully"});});
app.get("/protected",authenticateJWT,(req,res)=>res.json({message:"Protected route accessed successfully",user:req.user}));
const PORT=3000;app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
