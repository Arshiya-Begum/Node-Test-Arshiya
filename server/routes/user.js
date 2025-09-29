import express from 'express'
// import { getUsers, getUser, getEmployeeClients,filterUser, createClient, createEmployee, updateRole, updateUser, deleteUser, getClients, getEmployees, deleteWholeCollection } from '../controllers/user.js'
import { getUsers, getUser, getEmployeeClients,filterUser, createClient, createEmployee, updateRole, deleteUser, getClients, getEmployees, deleteWholeCollection, updateUser } from '../controllers/user.js'
import { verifyManager, verifyEmployee, verifyToken, verifySuperAdmin, verifyIsSameUser } from '../middleware/auth.js'
import { createError } from '../utils/error.js'
import { createUserValidator, updateUserValidator } from '../validators/users.js'

const router = express.Router()


// GET
router.get('/get/all', verifyToken, verifyManager, getUsers)
router.get('/get/single/:userId', verifyToken, verifyIsSameUser, getUser)
router.get('/get/clients', verifyToken, verifyEmployee, getClients)
router.get('/get/clients/employee', verifyToken, verifyEmployee, getEmployeeClients)
router.get('/get/employees', verifyToken, verifyEmployee, getEmployees)
router.get('/filter', verifyToken, verifyEmployee, filterUser)

// POST 
router.post('/create/client', verifyToken, verifyEmployee, createUserValidator, createClient)
router.post('/create/employee', verifyToken, verifyManager, createUserValidator, createEmployee)

// PUT
router.put('/update-role/:userId', verifyToken, verifyManager, updateRole)
router.put('/update-user/:userId', verifyToken, verifyIsSameUser, updateUserValidator, updateUser)

// DELETE
router.delete('/delete/:userId', verifyToken, verifySuperAdmin, deleteUser)
router.delete('/delete-whole-collection', deleteWholeCollection)

export default router