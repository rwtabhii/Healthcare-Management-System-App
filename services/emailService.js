export const sendEmail = async (email, subject, text) => {
    console.log(text);
    await transporter.sendMail({
        from: COMPANY_EMAIL,
        to: email,
        subject: subject,
        html: `<h2>${text}</h2>`, // you can send beautified text
    });
};


