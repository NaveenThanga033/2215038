import express from "express";
import Url from "./models/Url.js";
import Click from "./models/Click.js";
import generateShortcode from "./generatecode.js";
import { log } from "./middleware/log.js";

const router = express.Router();

router.post("/shorturls", async (req, res) => {
  try {
    const { url, validity=30, shortcode } = req.body;

    let code = shortcode || generateShortcode();
    let expiryDate = new Date(Date.now() + validity * 60000);

    const existing = await Url.findOne({shortCode:code});
    if (existing) return res.status(400).json({ error: "Shortcode exists" });

    const newUrl = new Url({
      originalUrl: url,
      shortCode: code,
      expiryDate
    });

    await newUrl.save();
    log("backend", "info", "controller",`Short URL created: ${code}`);
    res.json({
      shortLink: `http://localhost:5000/${code}`,
      expiry: expiryDate.toISOString()
    });
  } catch (err) {
    log("backend", "error", "controller", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const urlDoc = await Url.findOne({ shortCode: code });

    if (!urlDoc) return res.status(404).json({ error: "Shortcode not found" });
  //  if (new Date() > urlDoc.expiryDate) return res.status(410).json({ error: "Link expired" });

    urlDoc.clickCount += 1;
    await urlDoc.save();
    const click = new Click({
      shortCode: code,
      referrer: req.get("Referrer") || "direct",
      location: req.ip
    });
    await click.save();
    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    log("backend", "error", "controller", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/shorturls/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const urlDoc = await Url.findOne({ shortCode: code });
    if (!urlDoc) return res.status(404).json({ error: "Shortcode not found" });

    const clicks = await Click.find({ shortCode: code });

    res.json({
      totalClicks: urlDoc.clickCount,
      originalUrl: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt,
      expiryDate: urlDoc.expiryDate,
      clicks: clicks.map(c => ({
        timestamp: c.timestamp,
        referrer: c.referrer,
        location: c.location
      }))
    });
  } catch (err) {
    log("backend", "error", "controller", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
