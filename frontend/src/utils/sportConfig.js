/**
 * Returns the sport configuration based on the sport slug.
 * This determines which statistics and skills are visible and editable for a player.
 *
 * Important:
 * The database currently supports only these statistic keys:
 * matches, runs, wickets, goals, assists, bestPerformance
 *
 * The database currently supports only these skill keys:
 * batting, bowling, fielding, speed, stamina, teamwork, technique
 *
 * Because of that, some keys are reused with sport-specific labels.
 *
 * @param {string} slug - The sport's slug
 * @returns {object} The configuration containing hasCricketStyles, stats, and skills.
 */
export const getSportConfig = (slug) => {
  const sportSlug = (slug || "").toLowerCase();

  // Cricket and softball cricket
  if (["cricket", "softball-cricket"].includes(sportSlug)) {
    return {
      hasCricketStyles: true,
      stats: [
        { key: "matches", label: "Matches" },
        { key: "runs", label: "Runs" },
        { key: "wickets", label: "Wickets" },
      ],
      skills: [
        { key: "batting", label: "Batting" },
        { key: "bowling", label: "Bowling" },
        { key: "fielding", label: "Fielding" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Bat-and-ball team sports, but not cricket-style bowling fields
  if (["baseball", "elle"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Matches" },
        { key: "runs", label: "Runs" },
      ],
      skills: [
        { key: "batting", label: "Batting" },
        { key: "fielding", label: "Fielding" },
        { key: "speed", label: "Speed" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Goal-based team sports
  if (["football", "hockey", "handball", "water-polo"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Matches" },
        { key: "goals", label: "Goals" },
        { key: "assists", label: "Assists" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Stamina" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Rugby
  if (sportSlug === "rugby") {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Matches" },
        { key: "goals", label: "Tries / Points" },
        { key: "assists", label: "Assists" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Stamina" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Kabaddi
  if (sportSlug === "kabaddi") {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Matches" },
        { key: "goals", label: "Points" },
        { key: "assists", label: "Successful Raids / Tackles" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Stamina" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Basketball
  if (sportSlug === "basketball") {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Matches" },
        { key: "goals", label: "Points" },
        { key: "assists", label: "Assists" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Stamina" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Volleyball and beach volleyball
  if (["volleyball", "beach-volleyball"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Matches" },
        { key: "goals", label: "Points" },
        { key: "assists", label: "Assists / Blocks" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Stamina" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Athletics
  if (sportSlug === "athletics") {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Events" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Endurance" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Swimming and lifesaving
  if (["swimming", "lifesaving"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Events" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Endurance" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Rowing
  if (sportSlug === "rowing") {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Events" },
      ],
      skills: [
        { key: "stamina", label: "Endurance" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Individual racket sports
  if (["badminton", "table-tennis", "tennis", "squash"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Matches" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Stamina" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Gymnastics and aerobic gymnastics
  if (["gymnastics", "aerobic-gymnastics"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Events" },
      ],
      skills: [
        { key: "stamina", label: "Strength / Control" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Martial arts and combat sports
  if (["karate", "wushu", "boxing", "judo", "taekwondo"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Bouts / Events" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Stamina" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Weightlifting and powerlifting
  if (["weightlifting", "powerlifting"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Competitions" },
      ],
      skills: [
        { key: "stamina", label: "Strength / Power" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Archery and shooting
  if (["archery", "shooting"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Events" },
      ],
      skills: [
        { key: "stamina", label: "Focus / Control" },
        { key: "technique", label: "Accuracy / Technique" },
      ],
    };
  }

  // Golf
  if (sportSlug === "golf") {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Tournaments" },
      ],
      skills: [
        { key: "stamina", label: "Composure" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Chess and carrom
  if (["chess", "carrom"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Matches" },
      ],
      skills: [
        { key: "stamina", label: "Concentration" },
        { key: "technique", label: "Strategy / Technique" },
      ],
    };
  }

  // Roller skating
  if (sportSlug === "roller-skating") {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Events / Races" },
      ],
      skills: [
        { key: "speed", label: "Speed" },
        { key: "stamina", label: "Stamina" },
        { key: "technique", label: "Technique" },
      ],
    };
  }

  // Mountaineering and scouting
  if (["mountaineering", "scouting"].includes(sportSlug)) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Activities / Events" },
      ],
      skills: [
        { key: "stamina", label: "Endurance" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Outdoor Skills" },
      ],
    };
  }

  // Cadet activities
  if (
    [
      "cadet-corps",
      "junior-cadet-corps",
      "police-cadet-corps",
      "cadet-band",
    ].includes(sportSlug)
  ) {
    return {
      hasCricketStyles: false,
      stats: [
        { key: "matches", label: "Events / Performances" },
      ],
      skills: [
        { key: "stamina", label: "Discipline" },
        { key: "teamwork", label: "Teamwork" },
        { key: "technique", label: "Drill / Performance Skill" },
      ],
    };
  }

  // Fallback for any future sport
  return {
    hasCricketStyles: false,
    stats: [
      { key: "matches", label: "Matches / Events" },
    ],
    skills: [
      { key: "stamina", label: "Stamina" },
      { key: "teamwork", label: "Teamwork" },
      { key: "technique", label: "Technique" },
    ],
  };
};