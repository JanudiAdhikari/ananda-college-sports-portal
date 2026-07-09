require("dotenv").config();

const { spawn } = require("child_process");
const path = require("path");

const seeders = [
  "seedSports.js",
  "seedTeams.js",
  "seedPlayers.js",
  "seedFixtures.js",
  "seedLiveMatches.js",
  "seedGalleryAlbums.js",
  "seedUsers.js",
];

let currentIndex = 0;

const runSeeder = (seederName) => {
  return new Promise((resolve, reject) => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Running: ${seederName}`);
    console.log(`${"=".repeat(60)}`);

    const seederPath = path.join(__dirname, seederName);
    const child = spawn("node", [seederPath], {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✓ ${seederName} completed successfully\n`);
        resolve();
      } else {
        reject(new Error(`${seederName} failed with exit code ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
};

const runAllSeeders = async () => {
  try {
    console.log("🌱 Starting comprehensive data seeding...\n");

    for (const seeder of seeders) {
      await runSeeder(seeder);
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log("✓ All seeding completed successfully!");
    console.log(`${"=".repeat(60)}\n`);
    console.log("✓ Sports data loaded");
    console.log("✓ Teams created");
    console.log("✓ Players assigned");
    console.log("✓ Fixtures scheduled");
    console.log("✓ Live matches configured");
    console.log("✓ Gallery albums created");
    console.log("✓ Users created\n");
    console.log("You can now run the application and see all the data!");
    process.exit(0);
  } catch (error) {
    console.error(`\n✗ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

runAllSeeders();
