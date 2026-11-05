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
      placeId: { type: String, trim: true, maxlength: 300 }, // Google place confirmed by the server
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
      placeId: { type: String, trim: true, maxlength: 300 }, // Google place confirmed by the server
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
    preferredTime: { type: String, trim: true }, // e.g. "08:00", "14:30" — 07:00–21:00
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

    // Multiple stops between pickup and final delivery
    stops: [{
      postcode: { type: String, trim: true, uppercase: true },
      address:  { type: String, trim: true },
      floor:    { type: String, enum: FLOOR_VALUES },
      access:   { type: String, enum: ['Lift', 'Stairs', 'Both', '', null], default: undefined },
      lat: { type: Number },
      lon: { type: Number },
      placeId: { type: String, trim: true, maxlength: 300 }, // Google place confirmed by the server
    }],

    // Packing materials — customer-selectable items (all £internally-priced)
    packingMaterials: {
      requested:       { type: Boolean, default: false }, // true only if customer ticked the option
      smallBoxes:      { type: Number, min: 0, default: 0 },
      mediumBoxes:     { type: Number, min: 0, default: 0 },
      largeBoxes:      { type: Number, min: 0, default: 0 },
      bubbleWrapRolls: { type: Number, min: 0, default: 0 },
      tapeRolls:       { type: Number, min: 0, default: 0 },
      total:           { type: Number, default: 0 },
    },

    // Brand-new flat-pack furniture to assemble — priced separately by the admin
    flatPack: {
      required: { type: Boolean, default: false },
      items: [{
        _id: false,
        name:               { type: String, trim: true, maxlength: 120 },
        brand:              { type: String, trim: true, maxlength: 80 },
        quantity:           { type: Number, min: 1, max: 50, default: 1 },
        collectionLocation: { type: String, trim: true, maxlength: 250 },
        assemblyRequired:   { type: Boolean, default: true },
        notes:              { type: String, trim: true, maxlength: 500 },
      }],
      assemblyCharge: { type: Number, min: 0 },          // set by admin only
      assemblyNote:   { type: String, maxlength: 1000 }, // admin note to customer
      quotedAt:       { type: Date },
    },

    // Property + service details
    propertyDetails: {
      bedrooms:         { type: String, trim: true },     // e.g. "Studio", "3 Bedrooms"
      numBeds:          { type: Number, min: 0, default: 0 },
      numSofas:         { type: Number, min: 0, default: 0 },
      numLargeItems:    { type: Number, min: 0, default: 0 },
      dismantling:      { type: Boolean, default: false },
      reassembly:       { type: Boolean, default: false },
      packingService:   { type: Boolean, default: false }, // 'Packing service' extra requested
      parkingAvailable: { type: String, enum: ['yes', 'no', '', null], default: undefined },
    },

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
    // Itemised price shown to the customer: [{ label, amount }]
    priceBreakdown: [{ _id: false, label: { type: String }, amount: { type: Number } }],
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
