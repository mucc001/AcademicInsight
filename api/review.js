const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function get(_, { id }) {
  const db = getDb();
  const review = await db.collection('reviews').findOne({ id });
  return review;
}

const PAGE_SIZE = 10;

async function list(_, { 
  search, page,
}) {
  const db = getDb();
  const filter = {};
  if (search) filter.$text = { $search: search };
  
  const cursor = db.collection('reviews').find(filter)
    .sort({ id: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);
  const totalCount = await cursor.count(false);
  const reviews = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { reviews, pages };
}


function validate(review) {
  const errors = [];
  if (review.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function add(_, { review }) {
  const db = getDb();
  validate(review);

  const newReview = Object.assign({}, review);
  newReview.createdDate = new Date();
  newReview.id = await getNextSequence('reviews');
  const result = await db.collection('reviews').insertOne(newReview);
  const savedReview = await db.collection('reviews')
    .findOne({ _id: result.insertedId });
  return savedReview;
}

async function update(_, { id, changes }) {
  const db = getDb();
  if (changes) {
    const review = await db.collection('reviews').findOne({ id });
    Object.assign(review, changes);
    validate(review);
  }
  await db.collection('reviews').updateOne({ id }, { $set: changes });
  const savedReview = await db.collection('reviews').findOne({ id });
  return savedReview;
}

async function remove(_, { id }) {
  const db = getDb();
  const review = await db.collection('reviews').findOne({ id });
  if (!review) return false;
  review.deleted = new Date();

  let result = await db.collection('deleted_reviews').insertOne(review);
  if (result.insertedId) {
    result = await db.collection('reviews').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

module.exports = {
  get,
  list,
  add,
  update,
  delete: remove,
};
