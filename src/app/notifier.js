const nodemailer = require("nodemailer");
const logger = require("./logger");

const conf = require("../../mail.conf");
const transporter = nodemailer.createTransport(conf);

module.exports = {
  sendWarning() {
    transporter
      .sendMail({
        from: "pelmolen17@gmail.com",
        to: ["trigger@applet.ifttt.com"],
        subject: "#smokealarm",
        text: "WAARSCHUWING: Rookmelder ging af op Pelmolen 17 te Oploo.",
      })
      .then(() => {
        logger.log("Warning sent!");
      })
      .catch((error) => {
        logger.debug(error);
      });
  },
};
