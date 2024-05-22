import express from 'express';

const router = express.Router({});

router.get('/', async (_req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'App is up and running',
    timestamp: Date.now(),
  };

  try {
    res.send(healthcheck);
  } catch (e) {
    healthcheck.message = (e as Error).message;
    res.status(503).send();
  }
});

export = router;
