const notes = require('express').Router();
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
uuidv4();
const readFromFile = util.promisify(fs.readFile);
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData)
        }
    })
};

notes.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

notes.post('/notes', (req, res) => {

    const { title, text} = req.body;

    if (req.body) {
        const newSave = {
        title,
        text,
        noteId: uuid(),
        };

        readAndAppend(newSave, './db/db.json');
        res.json('Note Added');
    } else {
        res.error('Error in adding note');
}});

module.exports = notes