import express from 'express';
import {
  createTicket,
  internalCreateTicket,
  // createTicketdum,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  assignTicket,
  escalateTicket,
  resolveTicket,
  getRecentTickets,
  bulkUpdateTickets,
  addPublicComment,
  getPublicComments,
  addPrivateComment,
  getPrivateComments,
} from '../controllers/supportTicketController.js';
import { AdminProtect, commonProtect } from '../middlewares/authMiddleware.js';

// import { authenticateUser } from '../middlewares/auth.middleware.js'; // Adjust if needed

const router = express.Router();

// =======================
// Ticket Routes
// =======================

// ✅ Create ticket - Customer only
router.post('/', createTicket);

// ✅ Create ticket - Internal (Admin/Team)
router.post('/internal', AdminProtect, internalCreateTicket);

// ✅ Create ticket - Flexible (e.g., customer or internal with customerId)
// router.post('/dum', AdminProtect, createTicketdum);

// ✅ Get all tickets (with optional filters)
router.get('/', AdminProtect, getTickets);

// ✅ Get recent tickets (e.g., for dashboard)
router.get('/recent', AdminProtect, getRecentTickets);

// ✅ Get single ticket by ID
router.get('/:id', AdminProtect, getTicketById);

// ✅ Update ticket (description, issueType, priority)
router.patch('/:id', AdminProtect, updateTicket);

// ✅ Delete ticket
router.delete('/:id', AdminProtect, deleteTicket);

// ✅ Assign / Reassign ticket
router.post('/:id/assign', AdminProtect, assignTicket);

// ✅ Escalate ticket
router.post('/:id/escalate', AdminProtect, escalateTicket);

// ✅ Resolve ticket
router.post('/:id/resolve', AdminProtect, resolveTicket);

// ✅ Bulk update tickets (status, priority, etc.)
router.post('/bulk-update', AdminProtect, bulkUpdateTickets);

// ✅ Add attachment to a ticket

// router.post('/:ticketId/attachment', AdminProtect, upload.single('attachment'), addAttachmentToTicket);

// ✅ Add attachment to a comment

// router.post('/comment/:commentId/attachment', AdminProtect, upload.single('attachment'), addAttachmentToComment);

// Public Comment Routes
router.post('/:ticketId/public', commonProtect, addPublicComment);
router.get('/:ticketId/public', commonProtect, getPublicComments);

// Private Comment Routes (Internal Notes)
router.post('/:ticketId/private', AdminProtect, addPrivateComment);
router.get('/:ticketId/private', AdminProtect, getPrivateComments);

export default router;
