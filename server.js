import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { montarRotasDeEntregas } from './src/routes/entregasRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('layout', 'layouts/base');

app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(
  session({
    secret: 'delivery-tracker-secret',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.sucesso = req.flash('sucesso');
  res.locals.erro = req.flash('erro');
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.redirect('/entregas');
});

app.use('/', montarRotasDeEntregas());

app.use((req, res) => {
  res.status(404).render('erro', {
    titulo: 'Página não encontrada',
    status: 404,
    mensagem: 'A página que você tentou acessar não existe.',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Delivery Tracker rodando em http://localhost:${PORT}`,
  );
});