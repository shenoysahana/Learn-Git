/**
 * Blog.js
 * @description :: model of a database collection Blog
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {

    title:{ type:String },

    alternativeHeadline:{ type:String },

    image:{ type:String },

    publishDate:{ type:String },

    author:{
      name:{ type:String },
      image:{ type:String },
      email:{ type:String }
    },

    publisher:{
      name:{ type:String },
      url:{ type:String },
      logo:{ type:String }
    },

    articleSection:{ type:String },

    articleBody:{ type:String },

    description:{ type:String },

    slug:{ type:String },

    url:{ type:String },

    isDraft:{ type:Boolean },

    isDeleted:{ type:Boolean },

    isActive:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

    updatedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    addedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    }
  }
  ,{ 
    timestamps: { 
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt' 
    } 
  }
);
schema.index({ 'title':1 },{ 'name':'index_title' });
schema.index({ 'publishDate':-1 },{ 'name':'index_publishdate' });
schema.pre('save',async function (next){
  // 'this' refers to the current document about to be saved
  const record = this;
  // create slug using title
  let slug = record.title.toLowerCase();
  slug = slug.replace(/\s+/g,'-');
  // Replace and then store it
  record.slug = slug;
  next();
});
    
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length){
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method('toJSON', function () {
  const {
    _id, __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = _id;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const Blog = mongoose.model('Blog',schema);
module.exports = Blog;