const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro"
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }


    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype
      }
    };

    const prompt =
      "Identify the product in the image and return 5 short product-related keywords separated by commas.";

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    if (!responseText) {
      return res.status(500).json({ error: "No tags generated" });
    }

    const aiTags = responseText
      .toLowerCase()
      .replace(/\n/g, "")
      .split(",")
      .map(t => t.trim());

    console.log("Extracted tags:", aiTags);

    const synonymMap = {
      sneakers: "shoes",
      trainers: "shoes",
      footwear: "shoes",
      athletic: "sports",
      sportswear: "sports",
      running: "running"
    };

    const normalizedTags = aiTags.map(tag => {
      const words = tag.split(" ");
      return words.map(w => synonymMap[w] || w).join(" ");
    });

    console.log("Normalized tags:", normalizedTags);

    const products = await Product.find({
      $text: { $search: normalizedTags.join(" ") }
    });

    const scoredProducts = products.map(product => {
      const productTags = product.tags.map(t => t.toLowerCase());

      const relevance = normalizedTags.filter(tag =>
        productTags.some(
          pTag => tag.includes(pTag) || pTag.includes(tag)
        )
      ).length;

      return {
        ...product.toObject(),
        relevance
      };
    });

    const filtered = scoredProducts
      .filter(p => p.relevance >= 1)
      .sort((a, b) => b.relevance - a.relevance);

    return res.json(filtered);
  } catch (err) {
    console.error("Search API Error:", err.message);
    return res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
