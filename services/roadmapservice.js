const Match = require('../models/Match');
const RoadmapStep = require('../models/RoadMapStep');
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

  const prompt = `You are an expert learning path creator. Generate a 7-step roadmap for a skill swap where User A teaches "${skillAName}" and User B teaches "${skillBName}".
  
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

Ensure exactly 7 steps, each with a stepNumber from 1 to 7, a description, and a quiz with exactly 3 questions. The quiz must be for the skill taught in that step.`;


  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  });

  const responseText = completion.choices[0].message.content;

  // extraction logic for JSON array
  const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (!jsonMatch) {
    console.error('AI response text:', responseText);
    throw new Error('AI did not return a valid JSON array');
  }

  let stepsData;
  try {
    stepsData = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Failed to parse AI response as JSON:', err);
    throw new Error('AI returned invalid JSON');
  }

  if (!Array.isArray(stepsData) || stepsData.length !== 7) {
    throw new Error('AI did not return exactly 7 steps');
  }

  const savedSteps = [];
  for (const step of stepsData) {
    if (!step.stepNumber || !step.description || !step.quiz || !step.quiz.questions || step.quiz.questions.length !== 3) {
      throw new Error('Invalid step data from AI');
    }
    const roadmapStep = new RoadmapStep({
      matchId: match._id,
      stepNumber: step.stepNumber,
      description: step.description,
      quiz: {
        questions: step.quiz.questions,
        passingScore: step.quiz.passingScore || 70
      }
    });
    await roadmapStep.save();
    savedSteps.push(roadmapStep);
  }

  return savedSteps;
}

module.exports = { generateRoadmapForMatch };