import { Router } from 'express';
import { db } from '../database.js';
import {
  authenticateToken,
  requireRole
} from "../middleware/auth.js";

export const tasksRouter = Router();

function part3NotImplemented(req, res, next) {
  return res.status(501).json({
    error: "Part 3 middleware has not been implemented."
  });
}

tasksRouter.get(
    "/",
    authenticateToken,
    requireRole("student", "instructor"),
    (req, res) => {
      res.json({
        userId: req.user.sub,
        tasks: []
      });
    }
);

tasksRouter.get('/:id',
    authenticateToken,
    requireRole("student", "instructor"),
    async (req, res, next) => {
      try {
        // Query database using parameterized SQL and alias student_id as studentId
        const sql = `
          SELECT id, title, course, student_id AS studentId, completed
          FROM tasks
          WHERE id = ?
        `;
        const result = await db.query(sql, [req.params.id]);

        // 1. Return 404 if the task does not exist
        if (!result.rows || result.rows.length === 0) {
          return res.status(404).json({ error: 'Not Found' });
        }

        const task = result.rows[0];

        // 2. Check authorization: instructors can view any task, but students can only view their own
        if (req.user.role === 'student' && task.studentId !== req.user.sub) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        // 3. Convert integer 'completed' (0 or 1) to a JavaScript Boolean
        task.completed = Boolean(task.completed);

        // 4. Return 200 OK with the formatted task
        return res.json(task);
      } catch (error) {
        // Pass unexpected errors to Express error-handling middleware
        return next(error);
      }
    }
);

tasksRouter.delete(
    "/:id",
    authenticateToken,
    requireRole("instructor"),
    async (req, res, next) => {
      try {
        const result = await db.run(
            "DELETE FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (result.changes === 0) {
          return res.status(404).json({ error: "Not Found" });
        }

        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    }
);
