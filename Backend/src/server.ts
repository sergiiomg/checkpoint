import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes';
import { conectarDB } from './db';

const app = express();

/** Logging */
app.use(morgan('dev'));
/** Request parsing */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Routes */
app.use('/', routes);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');
    next(error);
});
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).json({
        message: err.message
    });
});

/** Server */
async function main() {
  await conectarDB(); // Aquí se abre la conexión

  const httpServer = http.createServer(app);
  const PORT: any = process.env.PORT ?? 8080;

  httpServer.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
  });
}

main();