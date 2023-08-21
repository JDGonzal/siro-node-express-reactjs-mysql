const nodemailer = require("nodemailer");
const setLog = require("./logs.utils.js");

function messageMail(email, urlRoute, iPos) {
  const aMessage = [`
  <html xmlns="http://www.w3.org/1999/xhtml">  
  <head>  
    <title></title> 
  </head>
    <body>
      <table>
        <tbody>
          <tr>
            <td>
              <div style="background-size: initial !important; background-repeat: initial !important; background-attachment: initial !important; background-origin: initial !important; background-clip: initial !important; background-color: rgba(255, 255, 255, 1) !important; border-radius: 6px; max-width: 800px; min-width: 600px; padding: 20px 30px">
                <div style="width: 100%; padding: 10px 0; text-align: center">
                  <!-- https://www.iconfinder.com/search?q=user -->
                  <img src="https://cdn1.iconfinder.com/data/icons/feather-2/24/user-check-128.png" width="80" height="80" />
                </div>
                <div style="width: 100%; height: 1px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgba(215, 222, 234, 1)"></div>
                <div style="text-align: center">
                  <h2 style="font-size: 18px; color: rgba(0, 104, 175, 1); margin-top: 50px">Welcome!</h2>
                  <p style="margin-top: 60px; color: rgba(35, 31, 32, 1); font-size: 16px; padding: 0 130px">
                    Hi <b>${email}</b>,
                  </p>
                  <p style="color: rgba(35, 31, 32, 1); font-size: 16px; font-weight: 500; margin: 35px 0 25px">
                    An account has been created for you. To gain access please click the button below.
                  </p>
                  <div style="margin: 60px 0 120px">
                    <a href="${urlRoute}" style="font-size: 14px; color: rgba(255, 255, 255, 1); background-color: rgba(78, 138, 201, 1); padding: 10px 60px; border-radius: 6px; text-decoration: none">
                      Activate Account
                    </a>
                  </div>
                </div>
                <div style="width: 100%; height: 1px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgba(215, 222, 234, 1)"></div>
                <div style="text-align: center">
                  <p style="color: rgba(158, 160, 165, 1); font-size: 12px; font-weight: 500; margin: 35px 0 25px">
                    This email and its contents (including any attachments, the "information") are intended only for the
                    person or entity to which the information is addressed. if you are not the intended recipient of the
                    information, be aware that any use, review retransmission, distribution, or reproduction of, or any action
                    taken in reliance on the contents of, the information is strictly prohibited. if you have received this
                    communication in error, please notify the sender immediately and delete the information entirely and
                    permanently from all systems.
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `, `
  <html xmlns="http://www.w3.org/1999/xhtml">  
  <head>  
    <title></title> 
  </head>
    <body>
      <table>
        <tbody>
          <tr>
            <td>
              <div style="background-size: initial !important; background-repeat: initial !important; background-attachment: initial !important; background-origin: initial !important; background-clip: initial !important; background-color: rgba(255, 255, 255, 1) !important; border-radius: 6px; max-width: 800px; min-width: 600px; padding: 20px 30px">
                <div style="width: 100%; padding: 10px 0; text-align: center">
                  <!-- https://www.iconfinder.com/search?q=user -->
                  <img src="https://cdn1.iconfinder.com/data/icons/feather-2/24/user-check-128.png" width="80" height="80" />
                </div>
                <div style="width: 100%; height: 1px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgba(215, 222, 234, 1)"></div>
                <div style="text-align: center">
                  <h2 style="font-size: 18px; color: rgba(0, 104, 175, 1); margin-top: 50px">¡Bienvenido!</h2>
                  <p style="margin-top: 60px; color: rgba(35, 31, 32, 1); font-size: 16px; padding: 0 130px">
                    Hola <b>${email}</b>,
                  </p>
                  <p style="color: rgba(35, 31, 32, 1); font-size: 16px; font-weight: 500; margin: 35px 0 25px">
                    Una cuenta fue creada para usted. Para tener acceso, de clic al botón de abajo.
                  </p>
                  <div style="margin: 60px 0 120px">
                    <a href="${urlRoute}" style="font-size: 14px; color: rgba(255, 255, 255, 1); background-color: rgba(78, 138, 201, 1); padding: 10px 60px; border-radius: 6px; text-decoration: none">
                      Activar la cuenta
                    </a>
                  </div>
                </div>
                <div style="width: 100%; height: 1px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgba(215, 222, 234, 1)"></div>
                <div style="text-align: center">
                  <p style="color: rgba(158, 160, 165, 1); font-size: 12px; font-weight: 500; margin: 35px 0 25px">
                    Este correo y su contenido (inclusive cualquier anexo o "Información") son destinados solo para la
                    persona o entidad a la cual la información fue dirigida. Si ustes no es el destinatario de la
                    información, revisar la retransmisión, distribución o reproducción de, o cualquier acción
                    tomada en base al contenido de, la información está estrictamente prohibida. Si ha recibido esta
                    comunicación por error, notifique al remitente inmediatamente y elimine la información por completo y
                    permanentemente de todos los sistemas.
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `];
  return aMessage[iPos]
}

async function sendEmail(email, subject, urlRoute, iPos) {
  const funcName = arguments.callee.name ;
  try {
    setLog("TRACE", __filename, funcName, `host:${process.env.EMAIL_HOST}, service:${process.env.EMAIL_SERVICE}, port:${process.env.EMAIL_PORT}`);
    const transporter = await nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      /*text: `Welcome!\n
      Hi ${email},\n 
      An account has been created for you. To gain access please click the button below.\n
      ${urlRoute}`,*/
      html: messageMail(email, urlRoute, iPos),
    });
    setLog("INFO", __filename, funcName, "email sent sucessfully");
  } catch (error) {
    setLog("ERROR", __filename, funcName, `email not sent:${JSON.stringify(error)}`);
  }
};

module.exports = sendEmail;
