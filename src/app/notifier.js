const logger = require("./logger");

const conf = require("../../mail.conf");
const mail = require("mail").Mail(conf);

module.exports = {
  sendWarning() {
    mail
      .message({
        from: conf.username,
        to: ["trigger@applet.ifttt.com"],
        subject: "#smokealarm",
      })
      .body("WAARSCHUWING: Rookmelder ging af op Pelmolen 17 in Oploo.")
      .send(function (err) {
        if (err) {
          throw err;
        }

        logger.log("Warning sent!");
      });
  },
};
