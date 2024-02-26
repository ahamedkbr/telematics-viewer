const mongoose = require("mongoose");

const deviceMetricSchema = new mongoose.Schema(
  {
    deviceImei: {
      type: String,
      required: true,
    },
    timestamp: Date,
    metadata: Object,
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "hours",
    },
    strict: false,
  },
);

module.exports = mongoose.model("DeviceMetrics", deviceMetricSchema);
