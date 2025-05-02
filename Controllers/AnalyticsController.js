const AnalyticsService = require("../Services/AnalyticsServices");

exports.generateAnalyticsSnapshot = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const adminId = req.user ? req.user._id : req.body.adminId;

    if (!adminId) {
      return res.status(400).json({ error: "adminId is required" });
    }

    const snapshot = await AnalyticsService.storeWeeklyAnalytics(adminId);

    res.status(201).json({
      message: "Weekly Analytics snapshot saved successfully",
      data: snapshot
    });
  } catch (error) {
    console.error("Error generating analytics snapshot:", error);
    res.status(500).json({ error: "Failed to store weekly analytics snapshot" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await AnalyticsService.getAnalytics();

    if (!analytics) {
      return res.status(404).json({ error: "No analytics data found" });
    }

    res.status(200).json({
      message: "Analytics fetched successfully",
      data: analytics
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
