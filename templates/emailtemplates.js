const userEmail = (name, password) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4CAF50;">Welcome to Our Platform</h2>
        <p>Dear Sir/Madam,</p>
        <p>We are pleased to inform you that your registration has been successfully completed. Below are your login credentials:</p>
        <ul style="list-style-type: none; padding: 0;">
            <li><strong>Username:</strong> ${name}</li>
            <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>Please keep your login details secure and do not share them with anyone.</p>
        <p>If you have any questions or need assistance, feel free to reach out to us.</p>
        <br>
        <address style="font-style: normal;">
            Best regards,<br>
            <strong>Support Team</strong><br>
            <a href="mailto:support@ecom.com">support@ecom.com</a><br>
            Visit us at: <a href="https://www.example.com" style="color: #4CAF50; text-decoration: none;">www.ecom.com</a><br>
            123 Main Street, Dhaka City<br>
            Bangladesh.
        </address>
    </div>`;
};

module.exports = { userEmail };
