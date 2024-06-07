const { faker } = require('@faker-js/faker');
const mysql= require("mysql2");
const express=require("express");
const methodOverride=require("method-override");
const app=express();
const path=require("path");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");

app.set("views",path.join(__dirname,"/views"));

const connection =  mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "delta_app",
    password: "Tarandeep123@",
  });
  let getRandomUser= ()=>{
    return [ faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
        faker.internet.password(),]  
    };

  // let q="SHOW TABLES";
  //INSERTING NEW DATA
  // let q="INSERT INTO user (id, name, email, password) VALUES(?,?,?,?)";
//   let q="INSERT INTO user (id, name, email, password) VALUES ?";
//   // let user=["123","123_newuser","123@gmail.com","abc"];
//   // let users=[["123b","123_newuserb","123@gmail.comb","abcb"],["123c","123_newuserc","123@gmail.comc","abcc"]];
//   let data=[];
//   for(let i=1;i<=100;i++){
//    data.push(getRandomUser());//100 fake users

//   }
//   try{
//     // connection.query(q,[users], (err,result)=>{
//       connection.query(q,[data], (err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         });
//   }
// catch(err){
//     console.log(err);
// }


// let getRandomUser= ()=>{
//     return {
//       userId: faker.string.uuid(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       avatar: faker.image.avatar(),
//       password: faker.internet.password(),
//       birthdate: faker.date.birthdate(),
//       registeredAt: faker.date.past(),
//     };
//   }


//   
// //   console.log(getRandomUser());
//HOME ROUTE
app.get("/",(req,res)=>{
  let q=`SELECT count(*) FROM user`;
    try{
    // connection.query(q,[users], (err,result)=>{
      connection.query(q, (err,result)=>{
        if(err) throw err;
        // console.log(result);
        // res.send(result);
            // console.log(result[0]["count(*)"]);
        let count= result[0]["count(*)"];
        // res.send("success");
        res.render("home.ejs",{count});
        });
  }
catch(err){
    console.log(err);
    res.send("some error in database");
}

});
//SHOW ROUTE
app.get("/user",(req,res)=>{
  let q=`SELECT * FROM user`;
    try{
    // connection.query(q,[users], (err,result)=>{
      connection.query(q, (err,users)=>{
        if(err) throw err;
      
        res.render("show.ejs",{users});
        });
  }  
  catch(err){
      console.log(err);
      res.send("some error in database");
  }

});
//EDIT ROUTE
app.get("/user/:id/edit",(req,res)=>{
  let id=req.params.id;
  let q=`Select * From user where id="${id}"`;
  try{
    // connection.query(q,[users], (err,result)=>{
      connection.query(q, (err,result)=>{
        if(err) throw err;
        let user=result[0];
        res.render("edit.ejs",{user});
        });
  }  
  catch(err){
      console.log(err);
      res.send("some error in database");
  }

});
//UPDATE ROUTE
app.patch("/user/:id",(req,res)=>{
  // let newname=req.params.name;
  let {id}=req.params;
  let {password:formPassword, name:newUsername}=req.body;

  let q1=`Select * From user where id="${id}"`;
  try{
    // connection.query(q,[users], (err,result)=>{
      connection.query(q1,(err,result)=>{
        if(err) throw err;
        let user=result[0];
        if(formPassword!=user.password){
          res.send("Wrong Password");
        }else{
  let q2=`update user set name="${newUsername}" where id="${id}"`;
connection.query(q2,(err,result)=>{
  if(err) throw err;
  res.redirect("/user");

});

        }
     
        });
  }  
  catch(err){
      console.log(err);
      res.send("some error in database");
  }

// res.send("updated");
});
//ADD A NEW USER
app.get("/user/add",(req,res)=>{

  res.render("add.ejs");
});
app.post("/user",(req,res)=>{
let {id,name,email,password}=req.body;
  let q3="Insert into user (id,name,email,password) Values (?,?,?,?)";
  connection.query(q3,[id,name,email,password],(err,result)=>{
res.redirect("user");
  });
});
app.get("/user/:id",(req,res)=>{
  res.render("delete.ejs");
});
app.delete("/user/:id",(req,res)=>{
  let {id}=req.params;
  let{password:enteredPassword,name:enteredName}=req.body;

 
  try{
    let q4=`Select * from user where name="${enteredName}"`;
    connection.query(q4,(err,result)=>{
      if(err) throw err;
      let user=result[0];
     if(enteredPassword!=user.password && enteredName!=user.name){
      res.send("Wrong Credentials! Try again");
     }
     else{
let q5=`Delete from user where name="${enteredName}"`;
connection.query(q5,(err,result)=>{
  res.send("user is deleted successfully");
});
     }
    });
  }
  catch(err){
    res.send(err);
  }

});

app.listen("8989",()=>{
  console.log("app is litening on port 8989");
})

