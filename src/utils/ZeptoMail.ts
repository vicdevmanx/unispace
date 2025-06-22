// src/utils/zeptomail.ts
export async function sendWorkspaceCredentials(email: string, password: string, workspaceName: string) {
  const apiKey = import.meta.env.VITE_ZEPTOMAIL_API_KEY;
  const sender = import.meta.env.VITE_ZEPTOMAIL_SENDER;
  const templateId = import.meta.env.VITE_ZEPTOMAIL_TEMPLATE_ID; // if using templates

  const payload = {
    from: { address: sender },
    to: [{ email_address: { address: email } }],
    subject: `Your UniSpace Workspace Login`,
    htmlbody: `
      <h2>Welcome to UniSpace!</h2>
      <p>Your workspace <b>${workspaceName}</b> has been created.</p>
      <p><b>Login Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <p><a href="https://unispace.com/workspace/login">Login here</a></p>
    `,
  };

  const res = await fetch('https://api.zeptomail.com/v1.1/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': `Zoho-enczapikey ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to send email');
  }
  return res.json();
}