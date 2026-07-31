import { Router } from 'express';
import { db } from '../database.js';

export const tasksRouter = Router();

tasksRouter.get('/', async (req, res, next) => {
  // TODO(PART 3): Add authentication and the student/instructor authorization middleware.
  try {
    const result = await db.query(
      `SELECT id, title, course, student_id AS studentId, completed
       FROM tasks ORDER BY id`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

tasksRouter.get('/:id', async (req, res, next) => {
  // TODO(PART 4): Add the required authentication and authorization middleware.
  // TODO(PART 4): Query req.params.id with parameterized SQL using db.query(sql, parameters).
  // TODO(PART 4): Return 404 when no task exists, allow instructors, and check student ownership.
  // TODO(PART 4): Return 403 for another student's task; return the task on success.
  // req.params.id, req.user.sub, req.user.role, db.query(), and next(error) are available here.
  return res.status(501).json({ error: 'Task-by-ID is not implemented yet.' });
});

tasksRouter.delete('/:id', async (req, res, next) => {
  // TODO(PART 3): Add authentication and instructor-only authorization middleware.
  try {
    const result = await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Not Found' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});
