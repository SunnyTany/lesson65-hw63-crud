import { ObjectId } from 'mongodb'
import { connectDB } from '../db/db.mjs'

export const getMainPage = (req, res) => {
  res.render('index', { title: 'MAIN PAGE' })
}

export const createUser = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')
    const user = await users.insertOne(req.body)
    users = db.collection('users')
    res.status(201).render('users', user)
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')
    const usersArr= await users.find({}).toArray()
    res.status(200).render('users')
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')
    const result = await users.deleteOne({ _id: new ObjectId(req.params.id) })

    console.log(result)
    if (result.deletedCount === 0) {
      return res.status(404).send('User not found')
    }
    res.status(200).send(`User with id ${req.params.id} deleted`)
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')
    const userId = req.params.id
    const updatedData = req.body
    const result = await users.updateOne({ _id: new ObjectId(userId) }, { $set: updatedData })
    if (result.matchedCount === 0) {
      return res.status(404).send('User not found')
    }
    res.status(200).send(`User with id ${userId} updated`)
  } catch (error) {
    next(error)
  }
}
