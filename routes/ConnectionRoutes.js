import express from 'express';
import {
  createConnection,
  getAllConnections,
  getConnectionById,
  updateConnection,
  deactivateConnection,
  deleteConnection,
  getFilteredConnections,
  updateSubscribedPlan,
  getSubscribedPlans,
} from '../controllers/ConnectionController.js';

const router = express.Router();

// Create a new connection
router.post('/', createConnection);

// Get all connections
router.get('/', getAllConnections);

// Get filtered connections (can combine with getAll if preferred)
router.get('/filter', getFilteredConnections);

// Get connection by ID
router.get('/:id', getConnectionById);

// Update connection by ID
router.patch('/:id', updateConnection);

// Soft deactivate connection by ID
router.patch('/:id/deactivate', deactivateConnection);

// Hard delete connection by ID
router.delete('/:id', deleteConnection);

// Add or update a subscription plan for a connection
router.post('/subscribe-plan', updateSubscribedPlan);

// Get all subscribed plans for a connection
router.get('/:connectionId/subscribed-plans', getSubscribedPlans);

export default router;
