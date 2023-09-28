import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './configs/base';
import { sendEmailWithTemplateService } from './services/send-email';

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


// CORS
app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Email server is running' });
})

app.post('/invite', async (req, res) => {
  const data = req.body;
  try {
    await sendEmailWithTemplateService({
      to_email: data.email,
      type: 'invite-user',
      data: {
        name: data.first_name,
        employer: data.company_name,
        companyId: data.company_id,
        subject: "Setup your Plannly Health Account",
        setup_user_link: `http://localhost:3000/activate-account?email=${data.email}&sid=${'password'}&cid=${data.company_id}`
      }
    });
    res.status(200).json({ error: false });

  } catch (error: any) {
    console.log('ERROR', error.message)
    res.status(500).json({ error: true, message: error.message, email: data.email });
  }
});

app.listen(config.server.port, () => {
  console.info(`Email server listening on ${config.server.hostname}:${config.server.port}`)
});