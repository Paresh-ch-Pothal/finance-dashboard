import express from "express";

import { protect, authorize, validateRequest } from "../middleware/auth";
import { deleteUser, getUsers, updateUser } from "../controllers/userControllers";
import { GeneralLimiter } from "../utils/rateLimiter";
import { body } from "express-validator";

const router = express.Router();


router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Admin only)
 */

/**
 * @swagger
 * /user/getUsers:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [Viewer, Analyst, Admin]
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */

// Only Admin can manage users
router.get("/getUsers",GeneralLimiter, authorize(["Admin"]), getUsers);


/**
 * @swagger
 * /user/updateUser/{id}:
 *   patch:
 *     summary: Update user role or active status (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [Viewer, Analyst, Admin]
 *                 example: Analyst
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.patch("/updateUser/:id",GeneralLimiter, authorize(["Admin"]),[
    body('role').optional().isIn(['Viewer', 'Analyst', 'Admin']).withMessage('Invalid role'),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  ],
  validateRequest, updateUser);

/**
 * @swagger
 * /user/deleteUser/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.delete("/deleteUser/:id",GeneralLimiter, authorize(["Admin"]), deleteUser);

export default router;