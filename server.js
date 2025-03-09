const express = require('express');
const { createTodo, updateTodo } = require('./types');
const { todo } = require('./db');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors());
app.post('/todo', async (req, res) => {
    const receivedPayload = req.body;
    const parsedPayload = createTodo.safeParse(receivedPayload);
    if (!parsedPayload.success) {
        res.status(411).json({ msg: "You sent the wrong inputs" })
        return;
    }
    if (receivedPayload.title == "") {
        res.status(411).json({ msg: "invalid input" });
        return;
    }
    await todo.create({
        title: receivedPayload.title,
        key: receivedPayload.key,
        done: false,
    });
    res.status(202).json({ msg: "todo added ", body: receivedPayload })


});
app.get('/todos', async (req, res) => {
    const allTodos = await todo.find();
    res.json(allTodos)
});
app.put('/completed', async (req, res) => {
    const updatedTodo = req.body;
    if (!updatedTodo || !updatedTodo.key) {
        return res.status(400).json({ msg: "Invalid request: Missing key" });
    }

    const newDoneStatus = !updatedTodo.completed;
    // res.json({ status: newDoneStatus });
    await todo.updateOne({ key: updatedTodo.key }, { done: newDoneStatus });
    res.json({ success: true, msg: `Todo marked as ${newDoneStatus ? "completed" : "not completed"}` });
});

app.put('/delete', async (req, res) => {
    const updatedTodo = req.body;
    const parsedPayload = updateTodo.safeParse(updatedTodo);
    if (!parsedPayload.success) {
        res.status(411).json({ msg: "You sent the incorrect inputs" })
        return;
    }
    todo.deleteOne({ key: req.body.key }).then(() => {

        console.log("deleted")
        res.json({ "msg": "deleted" });
    });
})

app.listen(1000);
