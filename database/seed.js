const db = require("./db");
const { Duck, User } = require("./index");

const seed = async () => {
  db.logging = false;
  await db.sync({ force: true }); // Drop and recreate tables

  const users = await User.bulkCreate([
    { username: "admin", passwordHash: User.hashPassword("password") },
    { username: "user1", passwordHash: User.hashPassword("password") },
    { username: "user2", passwordHash: User.hashPassword("password") },
  ]);

  console.log(`👤 Created ${users.length} users`);

  const ducks = await Duck.bulkCreate([
    { name: "James Pond" },
    { name: "Quakie Chan" },
    { name: "Goose" },
  ]);

  console.log(`🦆 Created ${ducks.length} ducks`);

  console.log("🌱 Seeded the database");
  db.close();
};

seed();
