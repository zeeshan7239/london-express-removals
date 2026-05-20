import mongoose from 'mongoose';

const FLOOR_VALUES = [
  'Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor',
  '5th Floor', '6th Floor', '6th Floor or Above',
  '2nd+ Floor', // legacy
];

const quoteSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ['booking', 'quote'], default: 'booking' },
    movingType: {
      type: String,
      enum: ['Studio', 'Flat', 'House', 'Office', 'Storage', 'Single Item'],
      required: true,
    },
    pickup: {
      postcode: { type: String, required: true, trim: true, uppercase: true },
      address: { type: String, trim: true },
      lat: { type: Number },
      lon: { type: Number },
      floor: { type: String, enum: FLOOR_VALUES },
      access: {
        type: String,
        enum: {
          values: ['Lift', 'Stairs', 'Both', '', null],
          message: 'Access must be Lift, Stairs, or Both',
        },
        default: undefined,
      },
    },
    delivery: {
      postcode: { type: String, required: true, trim: true, uppercase: true },
      address: { type: String, trim: true },
      lat: { type: Number },
      lon: { type: Number },
      floor: { type: String, enum: FLOOR_VALUES },
      access: {
        type: String,
        enum: {
          values: ['Lift', 'Stairs', 'Both', '', null],
          message: 'Access must be Lift, Stairs, or Both',
        },
        default: undefined,
      },
    },
    movingDate: { type: Date, required: true },
    moversNeeded: {
      type: String,
      enum: ['1 Man', '2 Men', '3 Men', 'Not Sure'],
      required: true,
    },
    durationHours: { type: Number, min: 2, max: 12 },
    distanceMiles: { type: Number },
    travelMinutes: { type: Number },
    isShortTrip: { type: Boolean, default: false },
    estimatedItems: { type: Number, min: 0 },
    notes: { type: String, maxlength: 1000 },
    images: [{ type: String }],
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'accepted', 'rejected', 'booked', 'completed', 'cancelled'],
      default: 'new',
    },
    estimatedPrice: { type: Number },
    adminResponse: {
      message: { type: String, maxlength: 2000 },
      respondedAt: { type: Date },
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ 'customer.email': 1 });
quoteSchema.index({ kind: 1, status: 1 });

const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
export default Quote;
