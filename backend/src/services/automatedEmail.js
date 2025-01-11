// backend/src/services/automatedEmail.js
const transporter = require('../config/emailConfig');

const sendEmail = async (email, subject, message) => {
    try {
        let mailOptions = {
            from: 'range.woods10@gmail.com',
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; color: #34495e; padding: 20px; background-color: #f4f4f4;">
                    <h1 style="color: #e4afc5; text-shadow: 2px 2px 5px #aaa;">${subject}</h1>
                    <p style="font-size: 16px; line-height: 1.6;">${message}</p>
                    <footer style="border-top: 1px solid #e4afc5; padding-top: 10px; margin-top: 20px; text-align: center;">
                        <p style="font-size: 0.8em; color: grey;">This is an automated message, please do not reply.</p>
                    </footer>
                </div>
            `
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            }
            console.log('Email sent:', info.response);
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;