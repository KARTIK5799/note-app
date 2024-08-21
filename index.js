const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) return res.status(500).send('Error reading directory');
        res.render('index', { files });
    });
});


app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        if (err) return res.status(500).send('Error reading file');
        res.render('task', { filename: req.params.filename, filedata });
    });
});

app.post('/update/:filename', (req, res) => {
    const newFilename = req.body.title.split(' ').join('') || req.params.filename.split(' ').join('');
    fs.rename(`./files/${req.params.filename}`, `./files/${newFilename}`, (err) => {
        if (err) return res.status(500).send('Error renaming file');
        fs.writeFile(`./files/${newFilename}`, req.body.description, (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.redirect('/');
        });
    });
});

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        if (err) return res.status(500).send('Error reading file');
        res.render('edit', { filename: req.params.filename, filedata });
    });
});


app.post('/create', (req, res) => {
    const title = req.body.title.split(' ').join('');
    fs.writeFile(`./files/${title}.txt`, req.body.description, (err) => {
        if (err) return res.status(500).send('Error creating file');
        res.redirect('/');
    });
});


app.post('/delete/:filename', (req, res) => {
    fs.rm(path.join(__dirname, 'files', req.params.filename), (err) => {
        if (err) {
            console.error(`Error deleting file ${path.join(__dirname, 'files', req.params.filename)}:`, err);
            return res.status(500).send('Error deleting file');
        }
        res.redirect('/');
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
