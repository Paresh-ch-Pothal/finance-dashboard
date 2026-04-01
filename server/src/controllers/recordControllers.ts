import { Request, Response } from "express";
import recordModel from "../models/recordModel";


interface AuthRequest extends Request {
  user?: any;
}

// get all records : viewer , analyst , admin

export const getRecords = async (req: AuthRequest, res: Response) => {
  const { type, category, from, to, page = 1, limit = 20 } = req.query;

  const filter: any = {};

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from as string);
  if (to) filter.date.$lte = new Date(to as string);

  try {
    const records = await recordModel.find(filter)
      .sort({ date: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate("createdBy", "name email role");

    const total = await recordModel.countDocuments(filter);

    res.status(200).json({ total, page: +page, limit: +limit, records });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// get dashboard : viewer , analyst , admin

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const incomeAgg = await recordModel.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expenseAgg = await recordModel.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const netBalance = totalIncome - totalExpenses;

    const categoryTotals = await recordModel.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const recentActivity = await recordModel.find({})
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({
      summary: { totalIncome, totalExpenses, netBalance },
      categoryTotals,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// get analayst : analyst , admin

export const getTrends = async (req: AuthRequest, res: Response) => {
  try {

    const trends = await recordModel.aggregate([
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    res.status(200).json({ trends });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// create record : admin only

export const createRecord = async (req: AuthRequest, res: Response) => {
  const { amount, type, category, date, description } = req.body;

  if (!amount || !type || !category || !date)
    return res.status(400).json({ message: "All required fields must be provided" });

  try {
    const record = await recordModel.create({
      amount,
      type,
      category,
      date,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// update record : admin only

export const updateRecord = async (req: AuthRequest, res: Response) => {
  const { amount, type, category, date, description } = req.body;

  try {
    const record = await recordModel.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    if (amount !== undefined) record.amount = amount;
    if (type) record.type = type;
    if (category) record.category = category;
    if (date) record.date = date;
    if (description) record.description = description;

    await record.save();

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// delete record : admin only

export const deleteRecord = async (req: AuthRequest, res: Response) => {
  try {
    const record = await recordModel.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    await recordModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};