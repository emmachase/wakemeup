import express from "express";
import expressWs from "express-ws";
import WebSocket from "ws";

const app = expressWs(express()).app;
const port = process.env.port || 3009;

let clients: WebSocket[] = [];

app.ws("/poll", (ws) => {
    clients.push(ws);
});

app.get("/poll", (req, res) => {
    res.status(400).send("This is a websocket endpoint").end();
})

app.use(express.json())
app.post("/annoy", (req, res) => {
    if (!req.body?.len)
        return res.sendStatus(400);

    if (typeof req.body.len != "number")
        return res.sendStatus(400);

    if (!clients.length)
        return res.sendStatus(503);

    clients = clients.filter(c => c.readyState == WebSocket.OPEN)
    clients.forEach(c => {
        c.send(req.body.len.toFixed());
    })

    return res.sendStatus(200);
})

app.listen(port, () => console.log(`Listening on port ${port}`));
