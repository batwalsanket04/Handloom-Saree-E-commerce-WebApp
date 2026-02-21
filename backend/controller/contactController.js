// Simple contact controller — logs incoming contact data and returns success
const submitContact = async (req, res) => {
  try {
    const data = req.body;
    console.log("Contact submission:", data);
    // TODO: save to DB or forward via email — currently just returns success
    res.json({ success: true, message: "Contact received" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ success: false, message: "Failed to submit contact" });
  }
};

export { submitContact };
