const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const FormData = require('form-data'); // Require the FormData library

const app = express();
const port = 3000;


app.use(express.static('public'));
app.use(fileUpload()); // Add the file upload middleware
app.set('view engine', 'ejs'); // Add this line


app.get('/', (req, res) => {
  res.render('server');
});
app.get('/result', (req, res) => {
  const jsonData = JSON.parse(req.query.jsonData);
  console.log("parsed",jsonData);
  res.render('result', { jsonData }); // Render the 'result.ejs' view and pass JSON data
});
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;
    
    const formData = new FormData(); // Create a new FormData object
    formData.append('file', uploadedFile.data, { filename: uploadedFile.name });

    const response = await axios.post('https://rapid-backend-td68.onrender.com/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    const jsonData = JSON.stringify(response.data);
    console.log(jsonData)
    res.redirect(`/result?jsonData=${jsonData}`);
    // console.log(response.data);
    // res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
