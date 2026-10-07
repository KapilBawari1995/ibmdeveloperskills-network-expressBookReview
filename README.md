# Book Review API

Node.js + Express.js REST API for an online book review application.

## Install
npm install

## Run
npm start

## Endpoints
GET /\nGET /isbn/:isbn\nGET /author/:author\nGET /title/:title\nGET /review/:isbn\nPOST /register\nPOST /login\nPOST /review/:isbn\nPUT /review/:isbn\nDELETE /review/:isbn

Review add/update/delete endpoints require: Authorization: Bearer YOUR_JWT_TOKEN

## Axios methods
`general.js` contains getAllBooks(), getBookByISBN(isbn), getBooksByAuthor(author), and getBooksByTitle(title).
