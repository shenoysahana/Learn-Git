/**
 * TaskController.js
 * @description : exports action methods for Task.
 */

const Task = require('../../../model/Task');
const TaskSchemaKey = require('../../../utils/validation/TaskValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Task in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Task. {status, message, data}
 */ 
const addTask = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      TaskSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Task(dataToCreate);
    let createdTask = await dbService.create(Task,dataToCreate);
    return res.success({ data : createdTask });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Task in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Tasks. {status, message, data}
 */
const bulkInsertTask = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id
      };
    }
    let createdTasks = await dbService.create(Task,dataToCreate);
    createdTasks = { count: createdTasks ? createdTasks.length : 0 };
    return res.success({ data:{ count:createdTasks.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Task from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Task(s). {status, message, data}
 */
const findAllTask = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      TaskSchemaKey.findFilterKeys,
      Task.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Task, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundTasks = await dbService.paginate( Task,query,options);
    if (!foundTasks || !foundTasks.data || !foundTasks.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundTasks });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Task from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Task. {status, message, data}
 */
const getTask = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundTask = await dbService.findOne(Task,query, options);
    if (!foundTask){
      return res.recordNotFound();
    }
    return res.success({ data :foundTask });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Task.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getTaskCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      TaskSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedTask = await dbService.count(Task,where);
    return res.success({ data : { count: countedTask } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Task with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Task.
 * @return {Object} : updated Task. {status, message, data}
 */
const updateTask = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      TaskSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedTask = await dbService.updateOne(Task,query,dataToUpdate);
    if (!updatedTask){
      return res.recordNotFound();
    }
    return res.success({ data :updatedTask });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Task with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Tasks.
 * @return {Object} : updated Tasks. {status, message, data}
 */
const bulkUpdateTask = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    delete dataToUpdate['addedBy'];
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { 
        ...req.body.data,
        updatedBy : req.user.id
      };
    }
    let updatedTask = await dbService.updateMany(Task,filter,dataToUpdate);
    if (!updatedTask){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedTask } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Task with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Task.
 * @return {obj} : updated Task. {status, message, data}
 */
const partialUpdateTask = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    delete req.body['addedBy'];
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      TaskSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedTask = await dbService.updateOne(Task, query, dataToUpdate);
    if (!updatedTask) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedTask });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Task from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Task.
 * @return {Object} : deactivated Task. {status, message, data}
 */
const softDeleteTask = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedTask = await dbService.updateOne(Task, query, updateBody);
    if (!updatedTask){
      return res.recordNotFound();
    }
    return res.success({ data:updatedTask });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Task from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Task. {status, message, data}
 */
const deleteTask = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedTask = await dbService.deleteOne(Task, query);
    if (!deletedTask){
      return res.recordNotFound();
    }
    return res.success({ data :deletedTask });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Task in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyTask = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedTask = await dbService.deleteMany(Task,query);
    if (!deletedTask){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedTask } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Task from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Task.
 * @return {Object} : number of deactivated documents of Task. {status, message, data}
 */
const softDeleteManyTask = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedTask = await dbService.updateMany(Task,query, updateBody);
    if (!updatedTask) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedTask } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addTask,
  bulkInsertTask,
  findAllTask,
  getTask,
  getTaskCount,
  updateTask,
  bulkUpdateTask,
  partialUpdateTask,
  softDeleteTask,
  deleteTask,
  deleteManyTask,
  softDeleteManyTask    
};