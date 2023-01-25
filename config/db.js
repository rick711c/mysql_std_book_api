const mysql=require("mysql");
const db_connection=mysql.createConnection({
    database:"std_book_api",
    host:"localhost",
    user:"sc",
    password:"sc",
})
module.exports=db_connection;