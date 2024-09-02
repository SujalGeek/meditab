const queueSchema = new mongoose.Schema({
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    bedType: {
      type: String,
      enum: ["General", "ICU", "Private", "Emergency"],
      required: true,
    },
    priority: {
    type: Number,
    enum: [1, 2, 3], // 1: Emergency, 2: High, 3: Regular
  },
    temporaryBed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bed',
      default: null,
    },
    entryTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Waiting', 'Allocated', 'TemporarilyAllocated', 'Cancelled'],
      default: 'Waiting',
    }
  }, { timestamps: true });
  
  export const Queue = mongoose.model('Queue', queueSchema);