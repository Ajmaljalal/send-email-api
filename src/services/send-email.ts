import SendgridMail from "../configs/sendgrid";


const templateIds: any = {
  "password-reset": "d-a27fdf6c8ed04873b25c662230c96857",
  "invite-user": "d-76e3ea4d358f4a58850bc5fa58ad6194",
}

type SendEmailRequest = {
  to_email: string;
  type: string;
  data: {
    name: string;
    employer: string;
    company_id: string;
    subject: string;
    setup_user_link: string;
  }
}

export const sendRawEmailService = async (request: SendEmailRequest) => {
  const msg = {
    to: request.to_email,
    from: 'hello@tryplannly.com',
    subject: request.data.subject,
    html: 'request.content',
  };
  try {
    const response = await SendgridMail.send(msg);
    return response
  } catch (error) {
    console.log('ERROR', error)
    return error;
  }
}

export const sendEmailWithTemplateService = async (request: any) => {
  const msg = {
    to: request.toEmail,
    from: 'no-reply@lannlyhealth.com',
    templateId: templateIds[request.type],
    dynamic_template_data: request.data,
  };
  try {
    const response = await SendgridMail.send(msg);
    return response
  }
  catch (error) {
    return error;
  }
}