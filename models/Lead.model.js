const leadSchema = new Schema(
  {
    leadOwner: {
      type: Types.ObjectId,
      required: true,
      refPath: 'leadOwnerModel',
    },
    leadOwnerModel: {
      type: String,
      required: true,
      enum: ['Team', 'Admin'],
    },
    leadCustomer: { type: Types.ObjectId, ref: 'Customer' },
    status: {
      type: String,
      enum: ['pending', 'converted', 'rewarded'],
      default: 'pending',
    },
    rewardDetails: {
      amount: Number,
      rewardType: String,
      rewardedAt: Date,
    },
  },
  { timestamps: true }
);
