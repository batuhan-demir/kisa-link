const express = require('express');
const { linkEkle, linkBul } = require('./linkYonetim');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 80;

app.use(express.static(__dirname + "/public"))

app.post("/yeni", (req, res) => {

    const { url, expires } = req.body;

    res.send(linkEkle(req.body));

})


app.get('/:link', (req, res) => {

    const link = linkBul(req.params.link);

    if (link.success)
        res.redirect(link.message.url)
    else
        res.status(link.status || 400).send(link.message)

})


app.listen(PORT, () => console.log(`${PORT} Portu Dinleniyor.`))