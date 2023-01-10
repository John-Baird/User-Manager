// Create User Form
const createUserForm = document.getElementById('create-user-form');
createUserForm.addEventListener('submit', (event) => {
  event.preventDefault();
    console.log("hm")
  const formData = new FormData(createUserForm);
  const user = Object.fromEntries(formData);

  fetch('/users', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then((data) => {
    window.location.href = '/users';
  });
});

// Edit User Form
const editUserForm = document.getElementById('edit-user-form');
editUserForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(editUserForm);
  const user = Object.fromEntries(formData);

  fetch(`/users/${user.userId}`, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then((data) => {
    window.location.href = '/users';
  });
});

// User Listing
const userListingTable = document.getElementById('user-listing');
fetch('/users')
  .then(response => response.json())
  .then((users) => {
    users.forEach((user) => {
      const row = userListingTable.insertRow();
      row.insertCell().innerHTML = user.username;
      row.insertCell().innerHTML = user.name;
      row.insertCell().innerHTML = user.email;
      row.insertCell().innerHTML = user.age;
      row.insertCell().innerHTML = `
        <a href="/users/${user.userId}/edit">Edit</a>
        <a href="/users/${user.userId}" data-method="delete">Delete</a>
      `;
    });
  });

// Delete User
document.addEventListener('click', (event) => {
  if (event.target.dataset.method === 'delete') {
    event.preventDefault();

    const url = event.target.getAttribute('href');
    fetch(url, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then((data) => {
      window.location.href = '/users';
    });
  }
});