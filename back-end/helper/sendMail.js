import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const sendEmailRegister = async (to, subject, text, url) => {
  // Configuration
const G_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const G_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const G_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const A_EMAIL = process.env.ADMIN_EMAIL;

// Create an OAuth2 client
const oAuthTwoClient = new OAuth2Client(
  G_CLIENT_ID,
  G_CLIENT_SECRET,
  G_REFRESH_TOKEN,
  REDIRECT_URI
);


  try {
    oAuthTwoClient.setCredentials({ refresh_token: G_REFRESH_TOKEN });
    // Get access token
    const accessToken = await oAuthTwoClient.getAccessToken();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: A_EMAIL,
        clientId: G_CLIENT_ID,
        clientSecret: G_CLIENT_SECRET,
        refreshToken: G_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Email details for user activation
    const mailOptions = {
      from: A_EMAIL,
      to: to,
      subject: subject,
      html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
      rel="stylesheet"
    />
    <title>Eat Word | Account Activation</title>
    <style>
      body {
        height: 100vh;
        margin: 0;
        font-family: "Roboto", sans-serif;
        color: #fff;
        background-color: #020817;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .container {
        max-width: 700px;
        padding: 20px;
        margin: auto;
        text-align: center;
      }

      .card {
        padding: 30px;
        background-color: #0a1128;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        text-align: left;
      }

      h1 {
        color: #ffffff;
        font-weight: 700;
        font-size: 24px;
        margin-bottom: 10px;
      }

      p {
        color: #d9d9d9;
        line-height: 1.6;
        margin: 10px 0;
        font-size: 16px;
      }

      a {
        text-decoration: none;
      }

      a button {
        padding: 12px 25px;
        background: #0056cc;
        border: none;
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 6px;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }

      a button:hover {
        background-color: #003a8c;
        transform: scale(1.05);
      }

      a button:focus {
        outline: none;
      }

      .secondary-text {
        font-size: 14px;
        color: #a1a1a1;
        margin-top: 15px;
        text-align: center;
      }

      .link {
        color: #70b4ff;
        word-break: break-word;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <h1>Welcome to Eat Word!</h1>
        <p>Thank you for registering. Please validate your email to activate your account:</p>
        <a href="${url}">
          <button>${text}</button>
        </a>
        <p class="secondary-text">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p class="link">${url}</p>
      </div>
    </div>
  </body>
</html>
`,
    };
    // Send email
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

const sendEmailForgotPass = async (to, subject, userName, url, text) => {

  // Configuration
const G_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const G_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const G_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const A_EMAIL = process.env.ADMIN_EMAIL;

// Create an OAuth2 client
const oAuthTwoClient = new OAuth2Client(
  G_CLIENT_ID,
  G_CLIENT_SECRET,
  G_REFRESH_TOKEN,
  REDIRECT_URI
);

  try {
    oAuthTwoClient.setCredentials({ refresh_token: G_REFRESH_TOKEN });
  // Get access token
  const accessToken = await oAuthTwoClient.getAccessToken();
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: A_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  // Email details for forgot password
const mailOptions = {
  from: A_EMAIL,
  to: to,
  subject: subject,
  html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
      rel="stylesheet"
    />
    <title>Eat Word | Password Reset</title>
    <style>
      body {
        height: 100vh;
        margin: 0;
        font-family: "Roboto", sans-serif;
        color: #fff;
        background-color: #020817;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .container {
        max-width: 700px;
        padding: 20px;
        margin: auto;
        text-align: center;
      }

      .card {
        padding: 30px;
        background-color: #0a1128;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        text-align: left;
      }

      h1 {
        color: #ffffff;
        font-weight: 700;
        font-size: 24px;
        margin-bottom: 10px;
      }

      p {
        color: #d9d9d9;
        line-height: 1.6;
        margin: 10px 0;
        font-size: 16px;
      }

      a {
        text-decoration: none;
      }

      a button {
        padding: 12px 25px;
        background: #0056cc;
        border: none;
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 6px;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }

      a button:hover {
        background-color: #003a8c;
        transform: scale(1.05);
      }

      a button:focus {
        outline: none;
      }

      .secondary-text {
        font-size: 14px;
        color: #a1a1a1;
        margin-top: 15px;
        text-align: center;
      }

      .link {
        color: #70b4ff;
        word-break: break-word;
      }

      .warning-text {
        color: #ffcc00;
        font-size: 14px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <h1>Password Reset Request</h1>
        <p>Hey ${userName}We received a request to reset your password for your Eat Word account.</p>
        <p>If you initiated this request, please click the button below to reset your password:</p>
        <a href="${url}">
          <button>${text}</button>
        </a>
        <p class="secondary-text">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p class="link">${url}</p>
        <p class="warning-text">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>
    </div>
  </body>
</html>
`,
};

// Send email
const result = await transporter.sendMail(mailOptions);
return result;
} catch (error) {
console.error("Error sending email:", error);
return error;
}

}

const sendEmailContact = async (name, senderEmail, message) => {
  const G_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const G_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const G_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
  const A_EMAIL = process.env.ADMIN_EMAIL;

  // Create an OAuth2 client
  const oAuth2Client = new OAuth2Client(
    G_CLIENT_ID,
    G_CLIENT_SECRET,
    REDIRECT_URI
  );

  try {
    oAuth2Client.setCredentials({ refresh_token: G_REFRESH_TOKEN });
    // Get access token
    const accessToken = await oAuth2Client.getAccessToken();

    // Create a Nodemailer transporter using OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: A_EMAIL,
        clientId: G_CLIENT_ID,
        clientSecret: G_CLIENT_SECRET,
        refreshToken: G_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: A_EMAIL,
      to: A_EMAIL,
      subject: "New Contact Message Received",
      html: `
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>New Contact Message</title>
        <style>
          body {
            background-color: #f2f2f2;
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          .info {
            margin-bottom: 10px;
            font-size: 16px;
          }
          .message {
            margin-top: 20px;
            font-size: 16px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Contact Message</h1>
          <p class="info"><strong>Name:</strong> ${name}</p>
          <p class="info"><strong>Email:</strong> ${senderEmail}</p>
          <p class="info"><strong>Message:</strong></p>
          <p class="message">${message}</p>
        </div>
      </body>
      </html>
      `,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

export { sendEmailContact, sendEmailForgotPass, sendEmailRegister };

