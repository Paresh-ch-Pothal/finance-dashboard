import express from "express";
import { protect, authorize, validateRequest } from "../middleware/auth";
import { createRecord, deleteRecord, getRecords, getSummary, getTrends, updateRecord } from "../controllers/recordControllers";
import { GeneralLimiter } from "../utils/rateLimiter";
import { body } from "express-validator";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial records management
 */

/**
 * @swagger
 * /record/getRecords:
 *   get:
 *     summary: Get all financial records with filters and pagination
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Income, Expense]
 *         description: Filter by record type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *         description: Start date filter
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-12-31
 *         description: End date filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Records per page (default 20)
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - insufficient role
 *       500:
 *         description: Server error
 */

// Viewer + Analyst + Admin
router.get("/getRecords", GeneralLimiter, authorize(["Viewer", "Analyst", "Admin"]), getRecords);

/**
 * @swagger
 * /record/summary:
 *   get:
 *     summary: Get dashboard summary - total Income, Expenses, net balance, category totals and recent activity
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 50000
 *                     totalExpenses:
 *                       type: number
 *                       example: 30000
 *                     netBalance:
 *                       type: number
 *                       example: 20000
 *                 categoryTotals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: Salary
 *                       total:
 *                         type: number
 *                         example: 50000
 *                 recentActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/summary", GeneralLimiter, authorize(["Viewer", "Analyst", "Admin"]), getSummary);

// analyst + admin only

/**
 * @swagger
 * /record/trends:
 *   get:
 *     summary: Get monthly Income and Expense trends (Analyst and Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trends fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                             example: 1
 *                           type:
 *                             type: string
 *                             example: Income
 *                       total:
 *                         type: number
 *                         example: 25000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Analyst or Admin only
 *       500:
 *         description: Server error
 */

router.get("/trends", GeneralLimiter, authorize(["Analyst", "Admin"]), getTrends);

// Admin only
/**
 * @swagger
 * /record/createRecord:
 *   post:
 *     summary: Create a new financial record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [Income, Expense]
 *                 example: Income
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               description:
 *                 type: string
 *                 example: Monthly salary credit
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Validation error or missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.post("/createRecord", GeneralLimiter, authorize(["Admin"]),
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['Income', 'Expense']).withMessage('Type must be Income or Expense'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isISO8601().toDate().withMessage('Date must be valid'),
  ],
  validateRequest, createRecord);


/**
* @swagger
* /record/updateRecord/{id}:
*   patch:
*     summary: Update an existing financial record (Admin only)
*     tags: [Records]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: MongoDB record ID
*         example: 64f1a2b3c4d5e6f7a8b9c0d1
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               amount:
*                 type: number
*                 example: 6000
*               type:
*                 type: string
*                 enum: [Income, Expense]
*               category:
*                 type: string
*                 example: Freelance
*               date:
*                 type: string
*                 format: date
*                 example: 2024-02-01
*               description:
*                 type: string
*                 example: Updated description
*     responses:
*       200:
*         description: Record updated successfully
*       400:
*         description: Validation error
*       401:
*         description: Unauthorized
*       403:
*         description: Forbidden - Admin only
*       404:
*         description: Record not found
*       500:
*         description: Server error
*/

router.patch("/updateRecord/:id", GeneralLimiter, authorize(["Admin"]),
  [
    body('amount').optional().isNumeric().withMessage('Amount must be a number'),
    body('type').optional().isIn(['Income', 'Expense']).withMessage('Type must be Income or Expense'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('date').optional().isISO8601().toDate().withMessage('Date must be valid'),
  ],
  validateRequest, updateRecord);

/**
 * @swagger
 * /record/deleteRecord/{id}:
 *   delete:
 *     summary: Delete a financial record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB record ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */


router.delete("/deleteRecord/:id", GeneralLimiter, authorize(["Admin"]), deleteRecord);

export default router;