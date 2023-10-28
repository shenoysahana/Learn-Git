/**
 * TaskRoutes.js
 * @description :: CRUD API routes for Task
 */

const express = require('express');
const router = express.Router();
const TaskController = require('../../../controller/device/v1/TaskController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/task/create').post(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.addTask);
router.route('/device/api/v1/task/list').post(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.findAllTask);
router.route('/device/api/v1/task/count').post(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.getTaskCount);
router.route('/device/api/v1/task/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.getTask);
router.route('/device/api/v1/task/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.updateTask);    
router.route('/device/api/v1/task/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.partialUpdateTask);
router.route('/device/api/v1/task/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.softDeleteTask);
router.route('/device/api/v1/task/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.softDeleteManyTask);
router.route('/device/api/v1/task/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.bulkInsertTask);
router.route('/device/api/v1/task/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.bulkUpdateTask);
router.route('/device/api/v1/task/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.deleteTask);
router.route('/device/api/v1/task/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,TaskController.deleteManyTask);

module.exports = router;
