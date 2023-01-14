const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


const methodOverride = require('method-override');
app.use(methodOverride('_method'));


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Use JSON middleware to parse incoming JSON data
app.use(express.json());

// Define the path to the views folder
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Get all users
app.get('/users', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    const users = JSON.parse(data);
    res.render('users', { users });
  });
});

// Create a new user
app.post('/users', (req, res) => {
  const newUser = { ...req.body, userId: Date.now() };
  
  if (!fs.existsSync('users.json')) {
    fs.writeFileSync('users.json', "[]")
  }
  
  fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    let users = JSON.parse(data);
    users.push(newUser);
    fs.writeFile('users.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      res.status(201).json(newUser);
    });
  });
});

// Edit a user
app.get('/users/:userId/edit', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    const users = JSON.parse(data);
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.userId === userId);
    if (!user) return res.status(404).send("User not found");
    res.render('edit-user', { user });
  });
});

app.post('/users/:userId', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    let users = JSON.parse(data);
    const userId = parseInt(req.params.userId);
    const userIndex = users.findIndex(user => user.userId === userId);
    if (userIndex === -1) return res.status(404).send("User not found");
    users[userIndex] = { ...req.body, userId };
    fs.writeFile('users.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      res.redirect('/users'); 
    });
  });
});
  
  // Delete a user
  app.delete('/users/:userId', (req, res) => {
    
    fs.readFile('users.json', (err, data) => {
      if (err) {
        return res.status(500).send("Error reading users.json file");
      }
      let users = JSON.parse(data);
      const userId = parseInt(req.params.userId);
      const userIndex = users.findIndex(user => user.userId === userId);
      if (userIndex === -1) {
        return res.status(404).send("User not found");
      }
      users.splice(userIndex, 1);
      fs.writeFile('users.json', JSON.stringify(users), (err) => {
        if (err) {
          return res.status(500).send("Error updating users.json file");
        }
        res.redirect('/users');
      });
    });
  });
// Serve the create user form
app.get('/create-user', (req, res) => {
res.render('create-user');
});


app.get('/create-user', (req, res) => {
  res.render('create-user');
});

// Start the server
app.listen(3000, () => {
console.log('Server listening on port 3000');
});