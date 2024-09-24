
const express = require("express")
const users = require("./MOCK_DATA.json"); //importing the users
const app = express()
const port = 7000
const fs = require("fs");


// middleware
app.use(express.urlencoded({ extended: false }));
// this middleware will add the json data to the body in post req


// routes
app.get("/", (req, res) => {
    res.send("Hello REST API")
})


// following req willl return the html doc
app.get("/users", (req, res) => {
    const html = `<ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join("")
        }
    </ul>`;
    res.send(html)
})

// following will return the json format file
app.get('/api/users', (req, res) => {
    return res.json(users);
    //   res.send('Hello World!')
})

// dynamic path 
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);  //convert the string into number
    const user = users.find(user => user.id === id);
    return res.json(user);
})

// routes
app.post("/api/users", (req, res) => {
    // create the new user
    // geting the data
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, res) => {
    });
    return res.json({ status: "success", id: users.length });
    // console.log("Body:" ,body)
    // res.json({status:"Pending"})
})

app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    console.log(userIndex);

    if(userIndex===-1){console.log("no user found")}

    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex]=updatedUser;

    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{
        if(err){

            return res.status(500).json({status:"Error in editing"})
        }
        res.json({status:"Success in edit" ,data:updatedUser})
    })

})



app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex(user => user.id === id);
    
    console.log(userIndex)

    if (userIndex === -1) {
        return res.status(404)
    }

    users.splice(userIndex, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            console.log("errror in deleting");
        }
    })
    res.json({ status: "Success", message: `user ieth the id ${id} has been deleted` })
})



app.listen(port, () => { console.log(`App listen at port ${port}`) })