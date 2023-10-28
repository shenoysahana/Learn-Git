/**
 * TaskValidation.js
 * @description :: validate each post and put request as per Task model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Task */
exports.schemaKeys = joi.object({
  title: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  attachments: joi.array().items(),
  status: joi.number().integer().allow(0),
  date: joi.date().options({ convert: true }).allow(null).allow(''),
  dueDate: joi.date().options({ convert: true }).allow(null).allow(''),
  completedBy: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  completedAt: joi.date().options({ convert: true }).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Task for updation */
exports.updateSchemaKeys = joi.object({
  title: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  attachments: joi.array().items(),
  status: joi.number().integer().allow(0),
  date: joi.date().options({ convert: true }).allow(null).allow(''),
  dueDate: joi.date().options({ convert: true }).allow(null).allow(''),
  completedBy: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  completedAt: joi.date().options({ convert: true }).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Task for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      title: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      description: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      attachments: joi.alternatives().try(joi.array().items(),joi.array().items(),joi.object()),
      status: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      date: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      dueDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      completedBy: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      completedAt: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
