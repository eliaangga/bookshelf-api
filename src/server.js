const express = require('express');
const app = express();
const PORT = 9000;

app.get('/', (req, res) => {
    res.send('Hello, Bookshelf API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
a