/* global db print */
/* eslint no-restricted-globals: "off" */

// db.reviews.remove({});
// db.deleted_reviews.remove({});

const reviewsDB = [
  {
    id: 1,
    title: 'CS5610 is awesome!',
    reviewer: 'Jamie',
    courseName: 'CS5610 Web Development',
    createdDate: new Date('2019-01-15'),
    courseDate: new Date('2019-01-15'),
    answer1: 'Steps to recreate the problem:'
      + '\n1. Refresh the browser.'
      + '\n2. Select "New" in the filter'
      + '\n3. Refresh the browser again. Note the warning in the console:'
      + '\n   Warning: Hash history cannot PUSH the same path; a new entry'
      + '\n   will not be added to the history stack'
      + '\n4. Click on Add.'
      + '\n5. There is an error in console, and add doesn\'t work.',
  },
  {
    id: 1,
    title: 'CS5004 teaches me a lot!',
    reviewer: 'Jack',
    courseName: 'CS5004',
    createdDate: new Date('2019-02-15'),
    courseDate: new Date('2019-02-15'),
    answer1: 'Steps to recreate the problem:'
      + '\n1. Refresh the browser.'
      + '\n2. Select "New" in the filter'
      + '\n3. Refresh the browser again. Note the warning in the console:'
      + '\n   Warning: Hash history cannot PUSH the same path; a new entry'
      + '\n   will not be added to the history stack'
      + '\n4. Click on Add.'
      + '\n5. There is an error in console, and add doesn\'t work.',
  },
];

db.reviews.insertMany(reviewsDB);
const count = db.reviews.count();
print('Inserted', count, 'reviews');

db.reviews.createIndex({ id: 1 }, { unique: true });
db.reviews.createIndex({
  title: 'text', answer1: 'text', answer2: 'text', answer3: 'text', answer4: 'text', additional: 'text',
});
db.reviews.createIndex({ reviewer: 1 });
db.reviews.createIndex({ createdDate: 1 });
db.reviews.createIndex({ courseDate: 1 });

db.deleted_issues.createIndex({ id: 1 }, { unique: true });

db.counters.remove({ _id: 'reviews' });
db.counters.insert({ _id: 'reviews', current: count });
