const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT), // Ensure port is number
    secure: process.env.NODE_ENV === 'production', // Use true for port 465, false for 587 or 2525
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Required for Mailtrap and some other development STMP servers
      // Remove or set to false in production if using standard certs
      rejectUnauthorized: process.env.NODE_ENV !== 'development'
    }
});

exports.sendEventApprovalEmail = async (adminEmail, eventDetails, userDetails) => {
    const frontendLink = `${process.env.FRONTEND_ORIGIN}/admin/events`; // Link to admin panel

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Campus Connect" <no-reply@campusconnect.com>',
        to: adminEmail,
        subject: `[ADMIN ACTION REQUIRED] New Event Pending Approval: ${eventDetails.title}`,
        html: `
            <p>Dear Admin,</p>
            <p>A new event titled "<strong>${eventDetails.title}</strong>" has been created by ${userDetails.fullname.firstname} ${userDetails.fullname.lastname} (${userDetails.email}) and is awaiting your approval.</p>
            <p><strong>Event Details:</strong></p>
            <ul>
                <li><strong>Title:</strong> ${eventDetails.title}</li>
                <li><strong>Description:</strong> ${eventDetails.description}</li>
                <li><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()} at ${eventDetails.time}</li>
                <li><strong>Location:</strong> ${eventDetails.location}</li>
                <li><strong>Category:</strong> ${eventDetails.category}</li>
                <li><strong>Organizer:</strong> ${userDetails.fullname.firstname} ${userDetails.fullname.lastname} (${userDetails.email})</li>
            </ul>
            <p>Please log in to the <a href="${frontendLink}">admin panel</a> to review and approve/reject this event.</p>
            <p>Thank you,</p>
            <p>The Campus Connect Team</p>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent for event: ${eventDetails.title} to admin.`);
    } catch (error) {
        console.error('Failed to send admin event approval email:', error);
    }
};

exports.sendEventStatusUpdateEmail = async (userEmail, eventDetails, newStatus, reason = '') => {
    const frontendLink = `${process.env.FRONTEND_ORIGIN}/events/${eventDetails._id}`;
    const organizerName = eventDetails.organizer.fullname.firstname || 'User';

    const subject = newStatus === 'approved'
        ? `[APPROVED] Your Event "${eventDetails.title}" Is Now Live!`
        : `[REJECTED] Update on Your Event "${eventDetails.title}"`;

    let messageHtml = '';
    if (newStatus === 'approved') {
        messageHtml = `
            <p>Dear ${organizerName},</p>
            <p>Great news! Your event "<strong>${eventDetails.title}</strong>" has been <strong>approved</strong> by our admin team and is now live on Campus Connect!</p>
            <p>Attendees can now RSVP. You can view your event details here: <a href="${frontendLink}">View Event</a>.</p>
        `;
    } else if (newStatus === 'rejected') {
        messageHtml = `
            <p>Dear ${organizerName},</p>
            <p>We regret to inform you that your event "<strong>${eventDetails.title}</strong>" has been <strong>rejected</strong> by our admin team.</p>
            ${reason ? `<p><strong>Reason for Rejection:</strong> ${reason}</p>` : ''}
            <p>Please review the event details and consider revising it, or contact our support team if you have any questions.</p>
        `;
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Campus Connect" <no-reply@campusconnect.com>',
        to: userEmail,
        subject: subject,
        html: `
            ${messageHtml}
            <p>Thank you,</p>
            <p>The Campus Connect Team</p>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Status update email sent to user ${userEmail} for event: ${eventDetails.title}. New status: ${newStatus}.`);
    } catch (error) {
        console.error('Failed to send event status update email:', error);
    }
};

exports.sendRsvpConfirmationEmail = async (userEmail, eventDetails, userName) => {
    const frontendLink = `${process.env.FRONTEND_ORIGIN}/events/${eventDetails._id}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Campus Connect" <no-reply@campusconnect.com>',
        to: userEmail,
        subject: `[RSVP CONFIRMED] You're Attending "${eventDetails.title}"!`,
        html: `
            <p>Dear ${userName || 'Attendee'},</p>
            <p>You have successfully RSVP'd for "<strong>${eventDetails.title}</strong>". We're excited to see you there!</p>
            <p><strong>Event Details:</strong></p>
            <ul>
                <li><strong>Title:</strong> ${eventDetails.title}</li>
                <li><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()} at ${eventDetails.time}</li>
                <li><strong>Location:</strong> ${eventDetails.location}</li>
            </ul>
            <p>You can view event details here: <a href="${frontendLink}">View Event</a>.</p>
            <p>See you soon,</p>
            <p>The Campus Connect Team</p>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`RSVP confirmation email sent to: ${userEmail} for event: ${eventDetails.title}.`);
    } catch (error) {
        console.error('Failed to send RSVP confirmation email:', error);
    }
};

exports.sendRsvpCancelledEmail = async (userEmail, eventDetails, userName) => {
    const frontendLink = `${process.env.FRONTEND_ORIGIN}/events/${eventDetails._id}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Campus Connect" <no-reply@campusconnect.com>',
        to: userEmail,
        subject: `[RSVP CANCELLED] Event "${eventDetails.title}"`,
        html: `
            <p>Dear ${userName || 'User'},</p>
            <p>You have successfully cancelled your RSVP for "<strong>${eventDetails.title}</strong>".</p>
            <p>If this was a mistake, you can always RSVP again through the event page: <a href="${frontendLink}">View Event</a>.</p>
            <p>Thank you,</p>
            <p>The Campus Connect Team</p>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`RSVP cancellation email sent to: ${userEmail} for event: ${eventDetails.title}.`);
    } catch (error) {
        console.error('Failed to send RSVP cancellation email:', error);
    }
};

// NEW: Email to club organizer when someone joins
exports.sendClubJoinedEmail = async (organizerEmail, clubName, memberName) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Campus Connect" <no-reply@campusconnect.com>',
        to: organizerEmail,
        subject: `New Member Joined Your Club: ${clubName}`,
        html: `
            <p>Dear Club Organizer,</p>
            <p><strong>${memberName}</strong> has joined your club: "<strong>${clubName}</strong>".</p>
            <p>Welcome your new member and continue fostering your community!</p>
            <p>The Campus Connect Team</p>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Club joined email sent to organizer for club: ${clubName}.`);
    } catch (error) {
        console.error('Failed to send club joined email:', error);
    }
};
