const express = require('express');
const client = require('./db/connect');
const app = express();
const port = 3000;
const path = require('path');
const upload = require('./utils/multer');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/get-pics', (req, res) => {
  client.query('SELECT name, path FROM pictures').then(data => {
    res.send(`<h1>All the files you uploaded: <br /> <br />
        ${data.rows.map(row => `<img src=${row.path} width=400 /> <br />`)}`);
  });
});

app.post('/upload-profile-pic', upload.single('profile_pic'), (req, res) => {
  if (!req.file) {
    res.status(404).send('No file has been uploaded.');
  } else {
    client
      .query('INSERT INTO pictures (name, path) VALUES ($1, $2) RETURNING *', [
        req.file.fieldname,
        req.file.path
      ])
      .then(data => {
        res.send(
          `<img src=${data.rows[0].path} alt=${data.rows[0].name} width="400" />
          <br /><br />
          <a href="http://localhost:3000/get-pics">Click here to see all your uploads</a>`
        );
      })
      .catch(err => console.log('Error uploading to db', err));
  }
});

app.post('/upload-cat-pics', upload.array('cat_pics'), (req, res) => {
  req.files.forEach(file =>
    client
      .query('INSERT INTO pictures (name, path) VALUES ($1, $2)', [
        file.fieldname,
        file.path
      ])
      .catch(err => console.log('Error uploading to db', err))
  );

  res.send(
    '' +
      req.files.map(file => {
        return `<img src=${file.path} alt=${file.fieldname} width="400" /> <br />`;
      }) +
      `<br /><br />
      <a href="http://localhost:3000/get-pics">Click here to see all your uploads</a>`
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/*
 */
