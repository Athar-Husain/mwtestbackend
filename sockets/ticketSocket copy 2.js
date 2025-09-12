// sockets/ticketSocket.js

import CommentModel from '../models/Comment.model.js';
import SupportTicket from '../models/SupportTicket.model.js';
import AdminModel from '../models/Admin.model.js';
import TeamModel from '../models/Team.model.js';
import CustomerModel from '../models/Customer.model.js';
import jwt from 'jsonwebtoken';

const activeUsers = {}; // socketId: userId

// Util: get user model
const getUserModel = (userType) => {
  switch (userType) {
    case 'Admin':
      return AdminModel;
    case 'Team':
      return TeamModel;
    case 'Customer':
      return CustomerModel;
    default:
      return null;
  }
};

const ticketSocketHandlers = (io, socket) => {
  console.log(`🧩 Ticket Socket: ${socket.id} connected`);

  // 🔐 Attach user to socket using JWT token
  socket.on('auth', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id, userType } = decoded;
      const Model = getUserModel(userType);

      if (!Model) return socket.emit('auth-error', 'Invalid user type');

      const user = await Model.findById(id).select('-password');
      if (!user) return socket.emit('auth-error', 'User not found');

      socket.user = user;
      socket.userType = userType;
      activeUsers[socket.id] = id;

      socket.emit('auth-success', { id: user._id, userType });
      console.log(`✅ Authenticated socket: ${socket.id}`);
    } catch (err) {
      console.error('Auth failed:', err.message);
      socket.emit('auth-error', 'Authentication failed');
    }
  });

  // 🏠 Join specific ticket room
  socket.on('join-ticket-room', (ticketId) => {
    socket.join(ticketId);
    console.log(`🛏️ ${socket.id} joined room ${ticketId}`);
  });

  // 💬 New comment added (public)
  socket.on('new-comment', async ({ ticketId, content }) => {
    try {
      if (!socket.user) {
        return socket.emit('error', 'Unauthorized. Please authenticate.');
      }

      const comment = new CommentModel({
        content,
        commentBy: socket.user._id,
        commentByModel: socket.userType,
      });

      await comment.save();

      // Attach to ticket (assumes ticket has comments array or reference)
      await SupportTicket.findByIdAndUpdate(ticketId, {
        $push: { comments: comment._id },
      });

      io.to(ticketId).emit('comment-received', {
        comment,
        by: {
          id: socket.user._id,
          type: socket.userType,
          name: socket.user.name || socket.user.fullName,
        },
      });

      console.log(`📨 New comment broadcasted in ticket ${ticketId}`);
    } catch (error) {
      console.error('Error saving comment:', error.message);
      socket.emit('error', 'Failed to post comment');
    }
  });

  // ✍️ Typing event
  socket.on('typing', ({ ticketId, isTyping }) => {
    if (socket.user) {
      socket.to(ticketId).emit('user-typing', {
        userId: socket.user._id,
        userType: socket.userType,
        isTyping,
      });
    }
  });

  // 🛠️ Ticket status update (optional)
  socket.on('ticket-updated', ({ ticketId, update }) => {
    io.to(ticketId).emit('ticket-status-updated', update);
  });

  // ❌ Disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 Ticket socket disconnected: ${socket.id}`);
    delete activeUsers[socket.id];
  });
};

export default ticketSocketHandlers;
