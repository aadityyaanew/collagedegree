// No static imports needed, receiving from caller

/**
 * Intelligent recommendation engine that analyzes student answers from the
 * Course Finder questionnaire and scores courses and colleges.
 */
export function getPersonalizedRecommendations(answers = {}, dbCourses = [], dbColleges = []) {
  const {
    education = "12th", // "10th", "12th", "graduate", "diploma"
    stream = "pcm", // "pcm", "pcb", "commerce", "arts", "vocational"
    percentage = "85_plus", // "85_plus", "70_85", "55_70", "below_55"
    interests = ["tech"], // array of interest keys
    careerGoals = ["high_salary"], // array of goal keys
    preferredCourseId = "all", // specific course id or "all"
    region = "all", // "all", "north", "south", "west", "east"
    budget = "flexible", // "budget_low", "budget_mid", "budget_high", "flexible"
    studyMode = "campus", // "campus", "hostel", "placement_focused"
  } = answers;

  // 1. Identify Target Course Level
  const isPostGraduate = education === "graduate" || education === "postgraduate";
  const targetLevel = isPostGraduate ? "PG" : "UG";

  // 2. Score Courses
  const scoredCourses = dbCourses.map((course) => {
    let score = 50; // base score
    const reasons = [];
    const courseId = course.slug || course.id;

    // Match Level
    if (course.level === targetLevel) {
      score += 25;
    } else {
      score -= 20;
    }

    // Match Stream
    if (stream === "pcm") {
      if (courseId.startsWith("btech") || courseId.includes("cs") || courseId === "barch") {
        score += 25;
        reasons.push("Perfect match for Science (PCM) students");
      }
    } else if (stream === "pcb") {
      if (courseId === "bpharm") {
        score += 35;
        reasons.push("Direct eligibility for Science (PCB) stream");
      }
    } else if (stream === "commerce") {
      if (courseId === "bba" || courseId === "mba") {
        score += 35;
        reasons.push("Direct alignment with Commerce & Management background");
      }
    } else if (stream === "arts") {
      if (courseId === "llb" || courseId === "bba") {
        score += 30;
        reasons.push("Excellent foundation for Arts & Humanities students");
      }
    }

    // Match Interests
    const interestSet = new Set(Array.isArray(interests) ? interests : [interests]);
    if (interestSet.has("tech") && (courseId.includes("btech") || courseId.includes("cs") || courseId === "mca")) {
      score += 20;
      reasons.push("Matches your interest in Software, Coding & AI");
    }
    if (interestSet.has("management") && (courseId === "bba" || courseId === "mba")) {
      score += 20;
      reasons.push("Matches your interest in Business Strategy & Leadership");
    }
    if (interestSet.has("healthcare") && courseId === "bpharm") {
      score += 20;
      reasons.push("Matches your healthcare and medical sciences interest");
    }
    if (interestSet.has("design") && courseId === "barch") {
      score += 20;
      reasons.push("Matches your passion for Creative Architecture & Design");
    }
    if (interestSet.has("law") && courseId === "llb") {
      score += 20;
      reasons.push("Matches your focus on Law, Corporate Advisory & Judiciary");
    }

    // Match Career Goals
    const goalSet = new Set(Array.isArray(careerGoals) ? careerGoals : [careerGoals]);
    if (goalSet.has("high_salary") && (courseId === "btech-cse" || courseId === "mba")) {
      score += 15;
      reasons.push("Highest average starting CTC in India (₹12 - ₹24 LPA)");
    }
    if (goalSet.has("research") && (courseId.includes("mtech") || courseId.includes("btech"))) {
      score += 15;
      reasons.push("High R&D and global master's admission rate");
    }
    if (goalSet.has("startup") && (courseId === "bba" || courseId === "mba" || courseId === "btech-cse")) {
      score += 15;
      reasons.push("Strong entrepreneurship and incubator network");
    }

    // Exact User Selected Course Preference Override
    if (preferredCourseId && preferredCourseId !== "all") {
      if (courseId === preferredCourseId) {
        score += 40;
        reasons.unshift("Your specifically preferred course");
      }
    }

    // Normalize match percentage
    const matchPercentage = Math.min(99, Math.max(65, Math.round((score / 150) * 100)));

    return {
      ...course,
      id: courseId,
      score,
      matchPercentage,
      reasons: reasons.slice(0, 3),
    };
  });

  // Sort courses by score
  const recommendedCourses = scoredCourses
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const topCourseIds = new Set(recommendedCourses.map((c) => c.id));

  // 3. Score Colleges
  const scoredColleges = dbColleges.map((college) => {
    let score = 50;
    const reasons = [];

    // Academic Score / Tier Compatibility
    if (percentage === "85_plus") {
      if (college.type === "IIT" || college.type === "NIT" || college.id === "bits-pilani" || college.id === "iiit-hyderabad") {
        score += 35;
        reasons.push("Eligible for top-tier cutoff with 85%+ score");
      } else {
        score += 15;
      }
    } else if (percentage === "70_85") {
      if (college.type === "NIT" || college.id === "vit-vellore" || college.id === "thapar-patiala" || college.id === "dtu-delhi") {
        score += 35;
        reasons.push("High admission probability for 70-85% profile");
      } else if (college.type === "IIT") {
        score += 10;
      } else {
        score += 20;
      }
    } else {
      // 55-70 or below 55
      if (college.type === "Private" || college.type === "Deemed") {
        score += 35;
        reasons.push("Direct admission & scholarship eligibility available");
      } else {
        score += 5;
      }
    }

    // Regional Filter
    const state = college.location.state.toLowerCase();
    const city = college.location.city.toLowerCase();
    const northStates = ["delhi", "punjab", "uttar pradesh", "haryana", "rajasthan", "chandigarh"];
    const southStates = ["tamil nadu", "karnataka", "telangana", "andhra pradesh", "kerala"];
    const westStates = ["maharashtra", "gujarat", "goa"];
    const eastStates = ["west bengal", "odisha", "bihar", "assam", "jharkhand"];

    if (region === "north" && northStates.some((s) => state.includes(s))) {
      score += 25;
      reasons.push(`Located in North India (${college.location.city})`);
    } else if (region === "south" && southStates.some((s) => state.includes(s))) {
      score += 25;
      reasons.push(`Located in South India (${college.location.city})`);
    } else if (region === "west" && westStates.some((s) => state.includes(s))) {
      score += 25;
      reasons.push(`Located in West India (${college.location.city})`);
    } else if (region === "east" && eastStates.some((s) => state.includes(s))) {
      score += 25;
      reasons.push(`Located in East India (${college.location.city})`);
    } else if (region === "all") {
      score += 15;
    }

    // Budget Compatibility
    const btechFee = college.fees?.btech || 1000000;
    if (budget === "budget_low") {
      if (college.type === "IIT" || college.type === "NIT" || btechFee <= 800000) {
        score += 25;
        reasons.push("Government subsidized fee structure (< ₹8 Lakh total)");
      }
    } else if (budget === "budget_mid") {
      if (btechFee >= 600000 && btechFee <= 1400000) {
        score += 20;
        reasons.push("Optimal fee-to-placement ROI within ₹2-3.5L/year");
      }
    } else if (budget === "budget_high") {
      score += 20;
    } else if (budget === "scholarship") {
      if (college.type === "Private" || college.type === "Deemed") {
        score += 25;
        reasons.push("Merit & entrance scholarships up to 100% tuition waiver");
      }
    }

    // High Placement / Career Preference
    if (college.placementPercentage >= 90) {
      score += 20;
      reasons.push(`${college.placementPercentage}% verified placement record`);
    }
    if (college.avgPackage >= 15) {
      score += 20;
      reasons.push(`High average package of ₹${college.avgPackage} LPA`);
    }

    // Check if college is listed as top for recommended courses
    const isTopForRecommended = recommendedCourses.some(
      (c) => c.topColleges && c.topColleges.includes(college.id)
    );
    if (isTopForRecommended) {
      score += 25;
      reasons.push(`Top ranked institute for ${recommendedCourses[0]?.shortName || "target course"}`);
    }

    // Calculate match percentage
    const matchPercentage = Math.min(99, Math.max(68, Math.round((score / 175) * 100)));

    return {
      ...college,
      score,
      matchPercentage,
      reasons: reasons.slice(0, 3),
    };
  });

  const recommendedColleges = scoredColleges
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return {
    recommendedCourses,
    recommendedColleges,
    profileSummary: {
      education,
      stream,
      percentage,
      interests,
      careerGoals,
      preferredCourse: recommendedCourses[0]?.name || "B.Tech Computer Science",
      preferredCourseShort: recommendedCourses[0]?.shortName || "B.Tech CSE",
      region,
      budget,
    },
  };
}
