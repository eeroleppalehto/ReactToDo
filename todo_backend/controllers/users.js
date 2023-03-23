const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req,res) => {
    const users = await User
        .find({}).populate('todos', { name: 1, completed: 1})
    res.json(users)
})

usersRouter.get('/:id', async (req,res) => {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

usersRouter.post('/', async (req, res) => {
    const{ username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

usersRouter.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

module.exports = usersRouter