const model = require('../config/groq');
const SkillTest = require('../models/SkillTest'); 
const UserSkill = require('../models/UserSkill');
const User = require('../models/User');
const Skill = require('../models/skill');
const generateTestSchema = require('../validations/generatetestvaliator');


exports.generateSkillTest = async (req, res, next) => {
  try {
    const { error, value } = generateTestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const { skillId, skillName, level } = value;

    const prompt = `You are a professional test creator. Generate a JSON object for a ${level} level multiple-choice test on the skill "${skillName}".
    The test must have exactly 5 questions.
    For each question, provide 4 answer options and specify the correct answer.
    Return ONLY a valid JSON object with a "questions" array.
    Each item in the array must be an object with keys: "question", "options", and "correctAnswer".
    The "options" array must contain exactly 4 strings.
    Example format: { "questions": [ { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." } ] }`;

    const chatCompletion = await model.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const responseText = chatCompletion.choices[0].message.content;
    const quizData = JSON.parse(responseText);

    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 5) {
      return res.status(500).json({ success: false, error: 'Invalid test structure generated' });
    }

    const newTest = new SkillTest({
      skillId,
      level,
      questions: quizData.questions,
      passingScore: 70,
    });

    await newTest.save();

    res.status(201).json({ success: true, data: newTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate test',
      message: error.message  });
  }

}
;