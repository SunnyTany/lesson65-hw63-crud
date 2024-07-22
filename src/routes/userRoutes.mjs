import express from 'express'
import { 
  getMainPage, 
  createUser, 
  deleteUser, 
  getUsers, 
  updateUser 
} from '../controllers/userControllers.mjs'

const router = express.Router()

router.get('/', getMainPage)

router.get('/users', getUsers)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router