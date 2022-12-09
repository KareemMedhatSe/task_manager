import express from 'express'
import auth from '../middleware/user_auth.js';
const router=express.Router();
import {create_task,delete_task,get_tasks,update_task} from '../controller/task.js'

router.get('/',auth,get_tasks)
 router.post('/',auth,create_task)
 router.delete('/:id',auth,delete_task)
router.patch('/:id',auth,update_task)


 export default router