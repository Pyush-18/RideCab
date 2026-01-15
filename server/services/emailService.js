import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const generateContactEmailTemplate = (contactDetails) => {
  const { name, email, phone, message, type } = contactDetails;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${
        type === "partnership" ? "Partnership Inquiry" : "Contact Message"
      }</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <tr>
                <td style="background: linear-gradient(135deg, ${
                  type === "partnership"
                    ? "#8b5cf6 0%, #7c3aed 100%"
                    : "#f59e0b 0%, #ea580c 100%"
                }); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    ${
                      type === "partnership"
                        ? "🤝 New Partnership Inquiry"
                        : "✉️ New Contact Message"
                    }
                  </h1>
                  <p style="margin: 10px 0 0 0; color: ${
                    type === "partnership" ? "#ede9fe" : "#fef3c7"
                  }; font-size: 14px;">
                    ${new Date().toLocaleString("en-IN", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <div style="background-color: ${
                    type === "partnership" ? "#ede9fe" : "#fef3c7"
                  }; border-left: 4px solid ${
    type === "partnership" ? "#8b5cf6" : "#f59e0b"
  }; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                    <p style="margin: 0; color: ${
                      type === "partnership" ? "#5b21b6" : "#92400e"
                    }; font-size: 14px; font-weight: 600;">
                      ${
                        type === "partnership"
                          ? "Partnership opportunity - Review and respond"
                          : "New inquiry - Please respond within 24 hours"
                      }
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 700;">
                    👤 Contact Information
                  </h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; padding: 20px;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #64748b; font-size: 13px; font-weight: 600;">${
                          type === "partnership" ? "Company/Name:" : "Name:"
                        }</span>
                        <span style="color: #1e293b; font-size: 14px; font-weight: 600; margin-left: 8px;">${name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #64748b; font-size: 13px; font-weight: 600;">Email:</span>
                        <a href="mailto:${email}" style="color: #f59e0b; font-size: 14px; margin-left: 8px; text-decoration: none;">${email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #64748b; font-size: 13px; font-weight: 600;">Phone:</span>
                        <a href="tel:${phone}" style="color: #f59e0b; font-size: 14px; margin-left: 8px; text-decoration: none;">${phone}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 700;">
                    💬 ${
                      type === "partnership" ? "Partnership Details" : "Message"
                    }
                  </h2>
                  <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                    <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 30px 30px 30px; text-align: center;">
                  <a href="mailto:${email}?subject=Re: ${
    type === "partnership" ? "Partnership Inquiry" : "Contact Message"
  }" 
                     style="display: inline-block; background: linear-gradient(135deg, ${
                       type === "partnership"
                         ? "#8b5cf6 0%, #7c3aed 100%"
                         : "#f59e0b 0%, #ea580c 100%"
                     }); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                    Reply to ${name}
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding: 24px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p style="margin: 0; color: #64748b; font-size: 13px;">
                    This is an automated notification from Fristcab Contact Form
                  </p>
                  <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 12px;">
                    © ${new Date().getFullYear()} Fristcab. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const sendContactNotification = async (contactDetails) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "connect@fristcab.com";

    if (!adminEmail) {
      throw new Error("Admin email not configured");
    }

    const { type } = contactDetails;

    const mailOptions = {
      from: {
        name: "Fristcab Contact Form",
        address: process.env.EMAIL_USER,
      },
      to: adminEmail,
      subject: `${
        type === "partnership"
          ? "🤝 New Partnership Inquiry"
          : "✉️ New Contact Message"
      } from ${contactDetails.name}`,
      html: generateContactEmailTemplate(contactDetails),
      text: `
        ${
          type === "partnership"
            ? "New Partnership Inquiry"
            : "New Contact Message"
        }
        
        ${type === "partnership" ? "Company/Name" : "Name"}: ${
        contactDetails.name
      }
        Email: ${contactDetails.email}
        Phone: ${contactDetails.phone}
        
        ${type === "partnership" ? "Partnership Details" : "Message"}:
        ${contactDetails.message}
        
        ---
        Received: ${new Date().toLocaleString("en-IN")}
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Contact notification email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending contact notification email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const generateBookingEmailTemplate = (bookingDetails) => {
  const {
    customerName,
    customerEmail,
    carName,
    carModel,
    from,
    to,
    amount,
    tripType,
    bookingDate,
    bookingId,
  } = bookingDetails;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    New Booking Received!
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #fef3c7; font-size: 14px;">
                    Booking ID: #${bookingId}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                      Immediate attention required - New customer booking
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 700;">
                    👤 Customer Details
                  </h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; padding: 20px;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #64748b; font-size: 13px; font-weight: 600;">Name:</span>
                        <span style="color: #1e293b; font-size: 14px; font-weight: 600; margin-left: 8px;">${customerName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #64748b; font-size: 13px; font-weight: 600;">Email:</span>
                        <span style="color: #1e293b; font-size: 14px; margin-left: 8px;">${customerEmail}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 700;">
                    📋 Booking Details
                  </h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td style="padding: 16px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                        <span style="color: #64748b; font-size: 13px; display: block; margin-bottom: 4px;">Vehicle</span>
                        <span style="color: #1e293b; font-size: 16px; font-weight: 700; display: block;">${carName}</span>
                        <span style="color: #64748b; font-size: 13px;">${carModel}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0;">
                        <span style="color: #64748b; font-size: 13px; display: block; margin-bottom: 8px;">Route</span>
                        <div style="display: flex; align-items: center;">
                          <span style="background-color: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; display: inline-block;">${from}</span>
                          <span style="margin: 0 12px; color: #94a3b8; font-size: 18px;">→</span>
                          <span style="background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; display: inline-block;">${to}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                        <span style="color: #64748b; font-size: 13px; display: block; margin-bottom: 4px;">Trip Type</span>
                        <span style="color: #1e293b; font-size: 14px; font-weight: 600; text-transform: capitalize;">${
                          tripType === "oneWay" ? "One-Way Drop" : "Round Trip"
                        }</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px; background-color: #ffffff;">
                        <span style="color: #64748b; font-size: 13px; display: block; margin-bottom: 4px;">Booking Date</span>
                        <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${new Date(
                          bookingDate
                        ).toLocaleString("en-IN", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; text-align: center; border: 2px solid #fbbf24;">
                    <span style="color: #92400e; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Total Amount</span>
                    <span style="color: #78350f; font-size: 36px; font-weight: 800; display: block;">${amount}</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 30px 30px 30px; text-align: center;">
                  <a href="${
                    process.env.ADMIN_DASHBOARD_URL ||
                    "http://localhost:5173/admin"
                  }" 
                     style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                    View in Dashboard
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding: 24px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p style="margin: 0; color: #64748b; font-size: 13px;">
                    This is an automated notification from your Cab Booking System
                  </p>
                  <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 12px;">
                    © ${new Date().getFullYear()} Your Company Name. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const sendBookingNotification = async (
  bookingDetails,
  adminSettings
) => {
  try {
    if (!adminSettings?.emailNotifications) {
      console.log("Email notifications are disabled");
      return { success: false, message: "Email notifications disabled" };
    }

    const adminEmail = process.env.ADMIN_EMAIL || adminSettings.email;

    if (!adminEmail) {
      throw new Error("Admin email not configured");
    }

    const mailOptions = {
      from: {
        name: "Cab Booking System",
        address: process.env.EMAIL_USER,
      },
      to: adminEmail,
      subject: `New Booking Alert - ${bookingDetails.carName} | ${bookingDetails.from} → ${bookingDetails.to}`,
      html: generateBookingEmailTemplate(bookingDetails),
      text: `
        New Booking Received!
        
        Booking ID: #${bookingDetails.bookingId}
        
        Customer Details:
        - Name: ${bookingDetails.customerName}
        - Email: ${bookingDetails.customerEmail}
        
        Booking Details:
        - Vehicle: ${bookingDetails.carName} (${bookingDetails.carModel})
        - Route: ${bookingDetails.from} → ${bookingDetails.to}
        - Trip Type: ${
          bookingDetails.tripType === "oneWay" ? "One-Way Drop" : "Round Trip"
        }
        - Amount: ${bookingDetails.amount}
        - Date: ${new Date(bookingDetails.bookingDate).toLocaleString()}
        
        View full details in your admin dashboard.
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Booking notification email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending booking notification email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  sendBookingNotification,
  sendContactNotification,
};
