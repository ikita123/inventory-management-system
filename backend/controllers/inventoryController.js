const Inventory = require("../models/Inventory");
const { getRedisClient } = require("../config/redisClient");
const { getChannel } = require("../config/rabbitmq");

exports.getItems = async (req, res) => {
  const redis = getRedisClient();

  const { search, name, category, minPrice, maxPrice, sortBy, order } =
    req.query;

  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  } else {
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category) {
      query.category = category;
    }
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortField = sortBy || "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  const isFilterApplied = !!(
    search ||
    name ||
    category ||
    minPrice ||
    maxPrice
  );

  let cacheKey = null;
  if (isFilterApplied) {
    cacheKey = `inventory:${JSON.stringify(req.query)}`;
    const cache = await redis.get(cacheKey);
    if (cache) {
      console.log("Cache hit!", cacheKey);
      return res.json(JSON.parse(cache));
    }
  }

  console.log("Query params:", req.query);
  console.log("MongoDB query:", query);

  const items = await Inventory.find(query).sort({ [sortField]: sortOrder });
  console.log("Found items:", items);

  if (isFilterApplied) {
    await redis.set(cacheKey, JSON.stringify(items), "EX", 60);
  }

  res.json(items);
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createItem = async (req, res) => {
  const item = await Inventory.create(req.body);
  const channel = getChannel();
  channel.sendToQueue(
    "inventory_updates",
    Buffer.from(JSON.stringify({ action: "create", item }))
  );
  res.status(201).json(item);
};

exports.updateItem = async (req, res) => {
  const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.deleteItem = async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
