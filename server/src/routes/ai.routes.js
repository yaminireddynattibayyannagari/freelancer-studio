import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  generateProposalSchema,
  generateFollowUpSchema,
  generateMilestonesSchema,
} from '../schemas/ai.schema.js';
import {
  generateProjectProposal,
  generateFollowUpEmail,
  generateProjectMilestones,
} from '../services/gemini.service.js';

const router = Router();

// Apply auth middleware to all AI routes
router.use(requireAuth);

/**
 * POST /api/ai/proposal
 * Generate complete project proposal with Google Gemini SDK
 */
router.post('/proposal', validate(generateProposalSchema), async (req, res) => {
  try {
    const result = await generateProjectProposal(req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error generating proposal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate proposal',
      message: error.message,
    });
  }
});

/**
 * POST /api/ai/follow-up
 * Generate professional client follow-up email
 */
router.post('/follow-up', validate(generateFollowUpSchema), async (req, res) => {
  try {
    const result = await generateFollowUpEmail(req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error generating follow-up:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate follow-up email',
      message: error.message,
    });
  }
});

/**
 * POST /api/ai/milestones
 * Suggest structured milestones from project scope
 */
router.post('/milestones', validate(generateMilestonesSchema), async (req, res) => {
  try {
    const result = await generateProjectMilestones(req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error generating milestones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate milestones',
      message: error.message,
    });
  }
});

export default router;
