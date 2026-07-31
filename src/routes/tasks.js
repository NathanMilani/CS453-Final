import { Router } from 'express';
import { db } from '../database.js';

export const tasksRouter = Router();

function part3NotImplemented(req, res, next) {
  return res.status(501).json({
    error: "Part 3 middleware has not been implemented."
  });
}

tasksRouter.get(
    "/",
    part3NotImplemented,
    /* TODO(PART 3): Add required middleware here. */
    (req, res) => {
      res.json({ userId: req.user.sub, tasks: [] });
    }
);

tasksRouter.get('/:id',
    part3NotImplemented,
    // TODO(PART 4): Add the required authentication and authorization middleware.
    async (req, res, next) => {
  // TODO(PART 4): Query req.params.id with parameterized SQL using db.query(sql, parameters).
  // TODO(PART 4): Return 404 when no task exists, allow instructors, and check student ownership.
  // TODO(PART 4): Return 403 for another student's task; return the task on success.
  // req.params.id, req.user.sub, req.user.role, db.query(), and next(error) are available here.
  return res.status(501).json({ error: 'Task-by-ID is not implemented yet.' });
});

tasksRouter.delete('/:id',
    part3NotImplemented,
    // TODO(PART 3): Add authentication and instructor-only authorization middleware.
    async (req, res, next) => {
  try {
    const result = await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Not Found' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});
