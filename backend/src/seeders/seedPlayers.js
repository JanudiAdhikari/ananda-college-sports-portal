require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Sport = require("../models/Sport");

const firstNames = [
  "Ruwan", "Chaminda", "Roshan", "Dilshan", "Pathum", "Wanindu", "Kusal", "Charith", "Dhananjaya", "Maheesh",
  "Matheesha", "Sadeera", "Lahiru", "Kasun", "Pramod", "Dunith", "Dinesh", "Avishka", "Minod", "Asitha",
  "Kamindu", "Chamika", "Bhanuka", "Nuwan", "Dushmantha", "Vishwa", "Lasith", "Angelo", "Akila", "Jeffrey",
  "Dasun", "Thisara", "Suranga", "Sachithra", "Milinda", "Seekkuge", "Kaushal", "Dilruwan", "Tharindu", "Dhammika",
  "Danushka", "Shehan", "Kanishka", "Heshan", "Gayan", "Chathuranga", "Janith", "Sandun", "Pasindu", "Sajith"
];

const lastNames = [
  "Perera", "Silva", "Fernando", "Mendis", "Karunaratne", "Jayasuriya", "Rajapaksa", "Herath", "Gunawardena", "Weerasinghe",
  "Bandara", "Liyanage", "Thirimanne", "Chameera", "Mathews", "Dananjaya", "Vandersay", "Pradeep", "Udana", "Shanaka",
  "Lakmal", "Senanayake", "Siriwardana", "Prasanna", "Prasad", "Gunathilaka", "Alwis", "Wijesinghe", "Sandaruwan", "Jayasekara",
  "Ranasinghe", "Kumara", "Wickramasinghe", "Samarawickrama", "Asalanka", "Theekshana", "Pathirana", "Madushanka", "Chandimal", "Rajitha",
  "Wellalage", "Cooray", "De Alwis", "De Silva", "Goonetilleke", "Hettiarachchi", "Lokuge", "Rodrigo", "Senaratne", "Tennekoon"
];

const getSportSpecificDetails = (sportName) => {
  const name = sportName || "";
  
  // Default values
  let role = "Athlete";
  let position = "All-rounder";
  let statistics = {
    matches: Math.floor(Math.random() * 20) + 5,
    runs: 0,
    wickets: 0,
    goals: 0,
    assists: 0,
    bestPerformance: "Consistent performer",
  };

  const matches = Math.floor(Math.random() * 25) + 5;

  if (name.toLowerCase().includes("cricket")) {
    const roles = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];
    role = roles[Math.floor(Math.random() * roles.length)];
    
    if (role === "Batsman") {
      position = ["Top Order", "Middle Order", "Lower Order"][Math.floor(Math.random() * 3)];
      const runs = Math.floor(Math.random() * 800) + 150;
      statistics = {
        matches,
        runs,
        wickets: 0,
        goals: 0,
        assists: 0,
        bestPerformance: `${Math.floor(Math.random() * 80) + 40}${Math.floor(Math.random() * 2) === 0 ? " runs" : " not out"}`,
      };
    } else if (role === "Bowler") {
      position = ["Fast Bowler", "Spinner", "Medium Pacer"][Math.floor(Math.random() * 3)];
      const wickets = Math.floor(Math.random() * 30) + 5;
      statistics = {
        matches,
        runs: Math.floor(Math.random() * 100) + 10,
        wickets,
        goals: 0,
        assists: 0,
        bestPerformance: `${Math.floor(Math.random() * 5) + 1}/${Math.floor(Math.random() * 30) + 10}`,
      };
    } else if (role === "All-rounder") {
      position = ["Batting All-rounder", "Bowling All-rounder"][Math.floor(Math.random() * 2)];
      const runs = Math.floor(Math.random() * 500) + 100;
      const wickets = Math.floor(Math.random() * 20) + 5;
      statistics = {
        matches,
        runs,
        wickets,
        goals: 0,
        assists: 0,
        bestPerformance: `${Math.floor(Math.random() * 50) + 30} runs & ${Math.floor(Math.random() * 3) + 1} wkts`,
      };
    } else { // Wicket-keeper
      position = "Wicket-keeper Batsman";
      const runs = Math.floor(Math.random() * 400) + 100;
      statistics = {
        matches,
        runs,
        wickets: 0,
        goals: 0,
        assists: 0,
        bestPerformance: `${Math.floor(Math.random() * 60) + 30} runs & ${Math.floor(Math.random() * 3) + 1} dismissals`,
      };
    }
  } else if (name.toLowerCase().includes("football") || name.toLowerCase().includes("soccer")) {
    const roles = ["Forward", "Midfielder", "Defender", "Goalkeeper"];
    role = roles[Math.floor(Math.random() * roles.length)];
    
    if (role === "Forward") {
      position = ["Striker", "Winger", "Center Forward"][Math.floor(Math.random() * 3)];
      const goals = Math.floor(Math.random() * 12) + 3;
      const assists = Math.floor(Math.random() * 8) + 1;
      statistics = {
        matches,
        runs: 0,
        wickets: 0,
        goals,
        assists,
        bestPerformance: `${goals} goals in the season`,
      };
    } else if (role === "Midfielder") {
      position = ["Attacking Midfielder", "Defensive Midfielder", "Central Midfielder"][Math.floor(Math.random() * 3)];
      const goals = Math.floor(Math.random() * 5) + 1;
      const assists = Math.floor(Math.random() * 12) + 3;
      statistics = {
        matches,
        runs: 0,
        wickets: 0,
        goals,
        assists,
        bestPerformance: `${assists} assists this season`,
      };
    } else if (role === "Defender") {
      position = ["Center Back", "Full Back", "Sweeper"][Math.floor(Math.random() * 3)];
      statistics = {
        matches,
        runs: 0,
        wickets: 0,
        goals: Math.floor(Math.random() * 2),
        assists: Math.floor(Math.random() * 3),
        bestPerformance: "Key clean sheets contributor",
      };
    } else { // Goalkeeper
      position = ["Starting Goalkeeper", "Reserve Goalkeeper"][Math.floor(Math.random() * 2)];
      statistics = {
        matches,
        runs: 0,
        wickets: 0,
        goals: 0,
        assists: 0,
        bestPerformance: `${Math.floor(Math.random() * 8) + 3} clean sheets`,
      };
    }
  } else if (name.toLowerCase().includes("rugby")) {
    role = Math.random() > 0.5 ? "Forward" : "Back";
    if (role === "Forward") {
      position = ["Prop", "Hooker", "Lock", "Flanker", "Number 8"][Math.floor(Math.random() * 5)];
    } else {
      position = ["Scrum-half", "Fly-half", "Center", "Winger", "Full-back"][Math.floor(Math.random() * 5)];
    }
    const tries = Math.floor(Math.random() * 8);
    statistics = {
      matches,
      runs: 0,
      wickets: 0,
      goals: 0,
      assists: 0,
      bestPerformance: tries > 0 ? `${tries} tries scored` : "Dominant tackle stats",
    };
  } else if (name.toLowerCase().includes("basketball")) {
    role = ["Guard", "Forward", "Center"][Math.floor(Math.random() * 3)];
    position = {
      "Guard": ["Point Guard", "Shooting Guard"],
      "Forward": ["Small Forward", "Power Forward"],
      "Center": ["Center"]
    }[role][Math.floor(Math.random() * (role === "Center" ? 1 : 2))];
    
    const ppg = Math.floor(Math.random() * 15) + 5;
    statistics = {
      matches,
      runs: 0,
      wickets: 0,
      goals: 0,
      assists: Math.floor(Math.random() * 40) + 10,
      bestPerformance: `Average ${ppg} PPG`,
    };
  } else if (name.toLowerCase().includes("volleyball")) {
    role = ["Attacker", "Setter", "Defender", "Libero"][Math.floor(Math.random() * 4)];
    position = {
      "Attacker": ["Outside Hitter", "Opposite Hitter", "Middle Blocker"],
      "Setter": ["Setter"],
      "Defender": ["Middle Blocker"],
      "Libero": ["Libero"]
    }[role][Math.floor(Math.random() * (role === "Attacker" ? 3 : 1))];
    
    statistics = {
      matches,
      runs: 0,
      wickets: 0,
      goals: 0,
      assists: 0,
      bestPerformance: "Solid block and service points",
    };
  } else if (name.toLowerCase().includes("hockey")) {
    role = ["Forward", "Midfielder", "Defender", "Goalkeeper"][Math.floor(Math.random() * 4)];
    position = {
      "Forward": ["Center Forward", "Winger"],
      "Midfielder": ["Inner", "Halfback"],
      "Defender": ["Fullback"],
      "Goalkeeper": ["Goalkeeper"]
    }[role][Math.floor(Math.random() * (role === "Goalkeeper" || role === "Defender" ? 1 : 2))];
    
    const goals = Math.floor(Math.random() * 6);
    statistics = {
      matches,
      runs: 0,
      wickets: 0,
      goals,
      assists: Math.floor(Math.random() * 5),
      bestPerformance: goals > 0 ? `${goals} goals this season` : "Strong defensive wall",
    };
  } else if (name.toLowerCase().includes("swimming")) {
    role = "Swimmer";
    position = ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"][Math.floor(Math.random() * 5)];
    const sec = (Math.random() * 15 + 22).toFixed(2);
    statistics = {
      matches,
      runs: 0,
      wickets: 0,
      goals: 0,
      assists: 0,
      bestPerformance: `Best timing: 50m in ${sec}s`,
    };
  } else if (name.toLowerCase().includes("athletics")) {
    role = "Athlete";
    position = ["100m Sprint", "200m Sprint", "400m Sprint", "800m Run", "Long Jump", "High Jump", "Javelin Throw"][Math.floor(Math.random() * 7)];
    let bp = "Gold medal in school meet";
    if (position.includes("Sprint")) {
      bp = `Best timing: ${(Math.random() * 3 + 10).toFixed(2)}s`;
    } else if (position === "Long Jump") {
      bp = `Best jump: ${(Math.random() * 2 + 5.5).toFixed(2)}m`;
    }
    statistics = {
      matches,
      runs: 0,
      wickets: 0,
      goals: 0,
      assists: 0,
      bestPerformance: bp,
    };
  }

  return { role, position, statistics };
};

const seedPlayers = async () => {
  try {
    await connectDB();

    // Clear existing players to remove past seeded data
    await Player.deleteMany({});
    console.log("Cleared existing players from database.");

    const teams = await Team.find().populate("sport");
    if (teams.length === 0) {
      console.warn("No teams found. Please seed teams first.");
      process.exit(1);
    }

    const players = [];

    // Create 3-5 players per team
    for (const team of teams) {
      const playerCount = Math.floor(Math.random() * 3) + 3; // 3-5 players
      const usedNamesInTeam = new Set();

      for (let i = 0; i < playerCount; i++) {
        let fullName;
        do {
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          fullName = `${firstName} ${lastName}`;
        } while (usedNamesInTeam.has(fullName));
        usedNamesInTeam.add(fullName);

        const jerseyNumber = Math.floor(Math.random() * 50) + 1;
        const sportName = team.sport ? team.sport.name : "";
        const sportDetails = getSportSpecificDetails(sportName);

        players.push({
          sport: team.sport._id,
          team: team._id,
          fullName,
          admissionNumber: `AC${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`,
          dateOfBirth: new Date(2005 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          ageGroup: team.ageGroup,
          jerseyNumber,
          role: sportDetails.role,
          position: sportDetails.position,
          performanceSummary: "Regular performer in school matches.",
          statistics: sportDetails.statistics,
          skillsRating: {
            batting: sportName.toLowerCase().includes("cricket") ? Math.floor(Math.random() * 40) + 60 : 0,
            bowling: sportName.toLowerCase().includes("cricket") ? Math.floor(Math.random() * 40) + 60 : 0,
            fielding: Math.floor(Math.random() * 30) + 70,
            speed: Math.floor(Math.random() * 30) + 70,
            stamina: Math.floor(Math.random() * 30) + 70,
            teamwork: Math.floor(Math.random() * 20) + 80,
            technique: Math.floor(Math.random() * 30) + 70,
          },
        });
      }
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const playerData of players) {
      const existingPlayer = await Player.findOne({
        team: playerData.team,
        fullName: playerData.fullName,
      });

      if (!existingPlayer) {
        await Player.create(playerData);
        createdCount++;
      } else {
        await Player.findByIdAndUpdate(existingPlayer._id, playerData, { new: true });
        updatedCount++;
      }
    }

    console.log(
      `Players seeding completed. Created: ${createdCount}, Updated: ${updatedCount}`
    );
    process.exit(0);
  } catch (error) {
    console.error(`Players seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedPlayers();
