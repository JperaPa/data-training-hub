import express from 'express';
import cors from 'cors';
import logsRouter from './src/routes/logs.js';

const app = express();
app.use(cors());
app.use(express.json());

// Register routes AFTER app is created
app.use('/api/logs', logsRouter);

app.listen(3000, () => {
  console.log('API server running on port 3000');
});
