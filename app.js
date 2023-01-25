const express = require("express");
const db_connection = require("./config/db")
const app = express();
const bodyParser = require('body-parser')

app.use(express.json());
app.listen(3000, () => {
    console.log("server started");
})
//making connection with database
db_connection.connect((err) => {
    if (err) {
        console.log("not connected");
    }
    else {
        console.log("connected!!");
    }
})
//insert student details api
app.post("/std", (req, res) => {
    const std_id = req.body.std_id;
    const std_name = req.body.std_name;
    db_connection.query('insert into std_info values(?,?)', [std_id, std_name], (err, result) => {
        if (err) {
            console.log("student data could not inserted");
        }
        else {
            console.log("student data inserted");
            res.send("done!!")
        }
    });
})
//insert book details api
app.post("/books", (req, res) => {
    const book_id = req.body.book_id;
    const book_name = req.body.book_name;
    const std_id = req.body.std_id;
    //validating std_id
    db_connection.query(`select * from std_info where std_id=${std_id}`, (err, result) => {
        //if valiadte
        if (Object.entries(result).length != 0) {

            db_connection.query('insert into book_info values(?,?,?)', [book_id, book_name, std_id], (err, result1) => {
                if (err) {
                    console.log("book data could not inserted");
                }
                else {
                        res.send("book data inserted");
                }
            });

        }
        //if not validate
        else {
            res.send("invalid std is");
        }
    });
});


//get all student details with book 
app.get('/all_students', (req, res) => {
    db_connection.query(`SELECT std_info.std_id, std_info.std_name FROM std_info JOIN book_info where std_info.std_id=book_info.std_id`, (err, result) => {
        if (err) {
            res.send("can't load all students")
        }
        else {
            res.send(result);
        }
    });
});
app.get('/home', (req, res) => {
    res.send("jgcdihcb");
})

//delete student by id
app.post("/delete_std", (req, res) => {
    const std_id = req.body.std_id;
    db_connection.query(`select * from std_info where std_id=${std_id}`, (err, result) => {
        if (Object.entries(result).length != 0) {
            db_connection.query(`select * from book_info where std_id=${std_id}`, (err, result1) => {
                if (Object.entries(result1).length != 0) {
                    res.send("please return all books and try again");
                }
                else {
                    db_connection.query(`delete from std_info where std_id=${std_id}`);
                    res.send("Deleted!!");
                }
            });
        }
        else{
            res.send("No student found")
        }
    });
    
})
//delete books by id or name
 app.post("/delete_book",(req,res)=>{
    const book_id=req.body.book_id;
    const book_name=req.body.book_name;
    console.log(book_id,book_name);
    if(book_id===undefined && book_name===undefined){
        res.send("please enter some parameter")
    }
    else if(book_id!==undefined || book_name!==undefined)
    {
        if(book_name!==undefined)
        {
            db_connection.query(`DELETE FROM book_info WHERE book_name=(?)`,[book_name],(err,result1)=>{
                console.log(book_name);
                if(err)
                {
                    res.send(err)
                }
                else{
                    if(result1.affectedRows==0){
                        res.send("no book found with this name")
                    }
                    else{
                         res.send("book deleted");
                    }
                }
            })
            
        }
        else{
            db_connection.query(`delete from book_info where book_id =(?)`,[book_id],(err,result2)=>{
                if(err)
                {
                    //res.send("could not delete book")
                    res.send(err);
                }
                else{

                    if(result2.affectedRows==0){
                        res.send("no book found with this id")
                        //res.send(result2)
                    }
                    else{

                         res.send("book deleted");
                        // res.send(result2)
                    }
                }
            })
        }
    }
 })
 app.post("/temp",(req,res)=>{
    const id=req.body.std_id;
     validate("std_info","std_id",id);
 })
function validate(table_name,column_name,what_to_match)
{
    db_connection.query(`select * from ${table_name} where ${column_name} = ${what_to_match}`,(err,result)=>{
        if(!err)
        {
            console.log(result);
        }
    });
}


 
 
