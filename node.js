const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/users', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    const users = JSON.parse(data);
    res.send(users);
  });
});

app.post('/users', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    let users = JSON.parse(data);
    const userId = Date.now();
    const user = { userId, ...req.body };
    users.push(user);
    fs.writeFile('users.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      res.send(user);
    });
  });
});

app.put('/users/:userId', (req, res) => {
    fs.readFile('users.json', (err, data) => {
      if (err) throw err;
      let users = JSON.parse(data);
      const userId = req.params.userId;
      const userIndex = users.findIndex(user => user.userId == userId);
      users[userIndex] = { userId, ...req.body };
      fs.writeFile('users.json', JSON.stringify(users), (err) => {
        if (err) throw err;
        res.send(users[userIndex]);
      });
    });
  });

app.delete('/users/:userId', (req, res) => {
fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    let users = JSON.parse(data);
    const userId = req.params.userId;
    const userIndex = users.findIndex(user => user.userId == userId);
    users.splice(userIndex, 1);
    fs.writeFile('users.json', JSON.stringify(users), (err) => {
    if (err) throw err;
    res.send({ message: 'User deleted successfully!' });
    });
});
});

app.listen(3000, () => {
console.log('Server listening on port 3000');
});