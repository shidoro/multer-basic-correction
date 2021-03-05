const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const upload = require('./utils/multer');

app.use(express.static(__dirname));

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload-profile-pic', upload.single('profile_pic'), (req, res) => {
  if (!req.file) {
    res.status(404).send('No file has been uploaded.');
  } else {
    res.send(
      `<img src=${req.file.path} alt=${req.file.fieldname} width="400" />`
    );
  }
});

app.post('/upload-cat-pics', upload.array('cat_pics'), (req, res) => {
  res.send(
    '' +
      req.files.map(file => {
        return `<img src=${file.path} alt=${file.fieldname} width="400" /> <br />`;
      })
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/*
 */
