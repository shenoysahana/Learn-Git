/**
 * TaskRoutes.js
 * @description :: CRUD API routes for Task
 */

const express = require('express');
const router = express.Router();
const TaskController = require('../../controller/admin/TaskController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/task/create').post(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.addTask);
router.route('/admin/task/list').post(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.findAllTask);
router.route('/admin/task/count').post(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.getTaskCount);
router.route('/admin/task/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.getTask);
router.route('/admin/task/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.updateTask);    
router.route('/admin/task/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.partialUpdateTask);
router.route('/admin/task/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.softDeleteTask);
router.route('/admin/task/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.softDeleteManyTask);
router.route('/admin/task/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.bulkInsertTask);
router.route('/admin/task/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.bulkUpdateTask);
router.route('/admin/task/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.deleteTask);
router.route('/admin/task/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,TaskController.deleteManyTask);

module.exports = router;
