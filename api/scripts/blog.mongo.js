/* global db print */
/* eslint no-restricted-globals: "off" */

db.blogs.remove({});
db.deleted_blogs.remove({});

const blogsDB = [
  {
    id: 1,
    title: 'Find a Roommate',
    creator: 'Jane H.',
    createdDate: new Date('2021-08-06'),
    content: 'Find a roommate',
  },
  {
    id: 2,
    title: 'Join our Music Club',
    creator: 'Tom',
    createdDate: new Date('2021-08-06'),
    content: 'Contact me if you\'re interested!',
  },
];

db.blogs.insertMany(blogsDB);
const count = db.blogs.count();
print('Inserted', count, 'blogs');

db.blogs.createIndex({ id: 1 }, { unique: true });
db.blogs.createIndex({ title: 1 });
db.blogs.createIndex({ creator: 1 });
db.blogs.createIndex({ createdDate: 1 });
db.blogs.createIndex({ content: 1 });

db.deleted_blogs.createIndex({ id: 1 }, { unique: true });

db.counters.remove({ _id: 'blogs' });
db.counters.insert({ _id: 'blogs', current: count });
