import express from 'express';
import {
  createMember,
  showMembers,
  showSingleMember,
  updateMember,
  deleteMember,
} from './member-controller.js';

const router = new express.Router();
router.post('/', createMember);
router.get('/', showMembers);
router.get('/:memId', showSingleMember);
router.put('/:memId', updateMember);
router.delete('/:memId', deleteMember);

export default { router };
