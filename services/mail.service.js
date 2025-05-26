const nodemailer = require("nodemailer");
const config = require("config");
const recipient = config.get("smtp_recipients");
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }
  async sendMail(recipients, otp) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: recipient,
      subject: "Kod",
      html: `
        <div>
          <h2>Siz uchun kod</h2>
          <h5>${otp}</h5>
        </div>`,
    });
  }
}
module.exports = new MailService();
