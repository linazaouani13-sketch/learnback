const Match = require('../models/match');
const RoadmapStep = require('../models/roadmapstep');
const groq = require('../config/groq'); 



async function generateRoadmapForMatch(matchId) {
  const match = await Match.findById(matchId)
    .populate('teachSkillAId', 'name')
    .populate('teachSkillBId', 'name');
  if (!match) throw new Error('Match not found');
  if (!match.teachSkillAId || !match.teachSkillBId) {
    throw new Error('Skills not found for this match');
  }

  const skillAName = match.teachSkillAId.name;
  const skillBName = match.teachSkillBId.name;

  const prompt = `You are an expert learning path creator. Generate a 6-step roadmap for a skill swap where User A teaches "${skillAName}" and User B teaches "${skillBName}".
  
The roadmap should alternate focus between the two skills (step1: learn ${skillAName}, step2: learn ${skillBName}, step3: learn ${skillAName}, etc.). For each step, provide a description of what both users should do (they work in parallel on their respective skills) and a short multiple‑choice quiz (3 questions) for the skill being learned in that step.

Return ONLY valid JSON in the format:
[
  {
    "stepNumber": 1,
    "description": "...",
    "quiz": {
      "questions": [
        { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." }
      ],
      "passingScore": 70
    }
  }
]

Ensure exactly 6 steps, each with a stepNumber from 1 to 6.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  });

  const responseText = completion.choices[0].message.content;
  const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (!jsonMatch) throw new Error('AI did not return a valid JSON array');
  let stepsData;
  try {
    stepsData = JSON.parse(jsonMatch[0]);
  } catch (err) {
    throw new Error('AI returned invalid JSON');
  }
  if (!Array.isArray(stepsData) || stepsData.length !== 6) {
    throw new Error('AI did not return exactly 6 steps');
  }

  const savedSteps = [];
  for (const step of stepsData) {
    if (!step.stepNumber || !step.description || !step.quiz || !step.quiz.questions || step.quiz.questions.length !== 3) {
      throw new Error('Invalid step data from AI');
    }
    // Determine target user: odd step -> teachSkillA (User B learns), even step -> teachSkillB (User A learns)
    const targetUserId = (step.stepNumber % 2 === 1) ? match.userBId : match.userAId;
    const roadmapStep = new RoadmapStep({
      matchId: match._id,
      stepNumber: step.stepNumber,
      description: step.description,
      quiz: {
        questions: step.quiz.questions,
        passingScore: step.quiz.passingScore || 70
      },
      targetUserId: targetUserId
    });
    await roadmapStep.save();
    savedSteps.push(roadmapStep);
  }
  return savedSteps;
}

module.exports = { generateRoadmapForMatch };