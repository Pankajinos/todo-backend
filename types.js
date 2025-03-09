const zod = require('zod');
const createTodo = zod.object({
    title: zod.string(),
    key: zod.string()
})
const updateTodo = zod.object({
    key: zod.string()
})
module.exports = {
    createTodo, updateTodo
}