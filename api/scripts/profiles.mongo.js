/* global db print */
/* eslint no-restricted-globals: "off" */

db.profiles.remove({});
db.deleted_profiles.remove({});

const profilesDB = [
  {
    id: 'johndoe@admin.com',
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@admin.com',
    password: 'johndoepasword',
  },
  {
    id: 'janesmith@admin.com',
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'janesmith@admin.com',
    password: 'janesmithpassword',
  },
];

db.profiles.insertMany(profilesDB);
const count = db.profiles.count();
print('Inserted', count, 'profiles');

db.profiles.createIndex({ id: 1 }, { unique: true });
db.profiles.createIndex({ firstname: 1 });
db.profiles.createIndex({ lastname: 1 });
db.profiles.createIndex({ email: 1 });
db.profiles.createIndex({ status: 1 });

db.deleted_profiles.createIndex({ id: 1 }, { unique: true });
