const Link = require("../models/Link");

const linkController = {
  // Get all links for a user
  getLinks: async (req, res) => {
    try {
      const userId = req.user._id;
      const links = await Link.find({ userId }).sort("order");
      res.json({ links });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Create new link
  createLink: async (req, res) => {
    try {
      const { platform, url, title, backgroundColor } = req.body;
      const userId = req.user._id;

      // Get the highest order number
      const lastLink = await Link.findOne({ userId }).sort("-order");
      const order = lastLink ? lastLink.order + 1 : 0;

      const newLink = await Link.create({
        userId,
        platform,
        url,
        title,
        backgroundColor,
        order,
      });

      res.status(201).json({ link: newLink });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Update link
  updateLink: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const updates = req.body;

      const updatedLink = await Link.findOneAndUpdate(
        { _id: id, userId },
        updates,
        { new: true }
      );

      if (!updatedLink) {
        return res.status(404).json({ message: "Link not found" });
      }

      res.json({ link: updatedLink });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Delete link
  deleteLink: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const deletedLink = await Link.findOneAndDelete({ _id: id, userId });

      if (!deletedLink) {
        return res.status(404).json({ message: "Link not found" });
      }

      // Reorder remaining links
      const remainingLinks = await Link.find({ userId }).sort("order");
      for (let i = 0; i < remainingLinks.length; i++) {
        await Link.findByIdAndUpdate(remainingLinks[i]._id, { order: i });
      }

      res.json({ message: "Link deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Reorder links
  reorderLinks: async (req, res) => {
    try {
      const { links } = req.body;
      const userId = req.user._id;

      for (const link of links) {
        await Link.findOneAndUpdate(
          { _id: link.id, userId },
          { order: link.order }
        );
      }

      const updatedLinks = await Link.find({ userId }).sort("order");
      res.json({ links: updatedLinks });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = linkController;
