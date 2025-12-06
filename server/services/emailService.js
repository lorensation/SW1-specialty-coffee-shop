import nodemailer from 'nodemailer';
import config from '../config/config.js';

/**
 * Email Service
 * Handles all email sending operations using Nodemailer
 */

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  /**
   * Send email
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      // Log email for development/debugging
      console.log('---------------------------------------------------');
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('Text body:', text);
      console.log('---------------------------------------------------');

      const info = await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        text,
        html,
      });

      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      // Return success: false but don't throw, so the client doesn't crash
      // In dev, we might want to pretend it worked if we logged it
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Pretending email was sent (check logs above)');
        return { success: true, messageId: 'dev-mock-id' };
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user) {
    const subject = 'Bienvenido a Royal Coffee';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a2c2a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #4a2c2a; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a Royal Coffee!</h1>
          </div>
          <div class="content">
            <h2>Hola ${user.name},</h2>
            <p>Gracias por registrarte en Royal Coffee. Estamos emocionados de tenerte con nosotros.</p>
            <p>Como miembro, podrás:</p>
            <ul>
              <li>Realizar pedidos de nuestros cafés de especialidad</li>
              <li>Reservar mesas en nuestra cafetería</li>
              <li>Dejar opiniones y reseñas</li>
              <li>Acceder a promociones exclusivas</li>
            </ul>
            <a href="${config.frontendUrl}/menu" class="button">Explorar nuestro menú</a>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Saludos,<br>El equipo de Royal Coffee</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Royal Coffee. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text: `Hola ${user.name}, bienvenido a Royal Coffee!`
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
    const subject = 'Restablece tu contraseña - Royal Coffee';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a2c2a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #4a2c2a; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Restablecimiento de Contraseña</h1>
          </div>
          <div class="content">
            <h2>Hola ${user.name},</h2>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Royal Coffee.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora.
            </div>
            <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            <p>Saludos,<br>El equipo de Royal Coffee</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Royal Coffee. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text: `Restablece tu contraseña usando este enlace: ${resetUrl}`
    });
  }

  /**
   * Send reservation confirmation email
   */
  async sendReservationConfirmation(reservation) {
    const subject = 'Confirmación de Reserva - Royal Coffee';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a2c2a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Reserva Confirmada</h1>
          </div>
          <div class="content">
            <h2>Hola ${reservation.name},</h2>
            <p>Tu reserva ha sido confirmada. ¡Te esperamos!</p>
            <div class="details">
              <h3>Detalles de tu reserva:</h3>
              <p><strong>Fecha:</strong> ${new Date(reservation.reservation_date).toLocaleDateString('es-ES')}</p>
              <p><strong>Hora:</strong> ${reservation.reservation_time}</p>
              <p><strong>Personas:</strong> ${reservation.num_people}</p>
              ${reservation.message ? `<p><strong>Nota:</strong> ${reservation.message}</p>` : ''}
            </div>
            <p>Si necesitas modificar o cancelar tu reserva, contáctanos lo antes posible.</p>
            <p>Saludos,<br>El equipo de Royal Coffee</p>
          </div>
          <div class="footer">
            <p>Royal Coffee | Calle Ejemplo 123 | Tel: +34 XXX XXX XXX</p>
            <p>&copy; ${new Date().getFullYear()} Royal Coffee. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: reservation.email,
      subject,
      html,
      text: `Reserva confirmada para ${reservation.num_people} personas el ${reservation.reservation_date} a las ${reservation.reservation_time}`
    });
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(order) {
    const subject = `Confirmación de Pedido #${order.order_number}`;
    const itemsList = order.items.map(item =>
      `<tr><td>${item.product_name}</td><td>${item.quantity}</td><td>${item.product_price.toFixed(2)}€</td><td>${item.subtotal.toFixed(2)}€</td></tr>`
    ).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a2c2a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; font-weight: bold; }
          .total { font-size: 18px; font-weight: bold; color: #4a2c2a; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Pedido Confirmado</h1>
            <p>Número de pedido: #${order.order_number}</p>
          </div>
          <div class="content">
            <h2>Gracias por tu pedido!</h2>
            <p>Tu pedido ha sido recibido y está siendo procesado.</p>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3"><strong>Subtotal</strong></td>
                  <td><strong>${order.subtotal.toFixed(2)}€</strong></td>
                </tr>
                <tr>
                  <td colspan="3"><strong>IVA (10%)</strong></td>
                  <td><strong>${order.tax.toFixed(2)}€</strong></td>
                </tr>
                <tr class="total">
                  <td colspan="3">TOTAL</td>
                  <td>${order.total.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>
            <p>Te notificaremos cuando tu pedido esté listo.</p>
            <p>Saludos,<br>El equipo de Royal Coffee</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Royal Coffee. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: order.email,
      subject,
      html,
      text: `Pedido #${order.order_number} confirmado. Total: ${order.total.toFixed(2)}€`
    });
  }

  /**
   * Send admin notification
   */
  async sendAdminNotification({ subject, message, data }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          pre { background: white; padding: 15px; border-radius: 4px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Notificación de Admin</h1>
          </div>
          <div class="content">
            <h2>${subject}</h2>
            <p>${message}</p>
            ${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: config.admin.email,
      subject: `[Admin] ${subject}`,
      html,
      text: message
    });
  }
}

// Export singleton instance
const emailService = new EmailService();
export default emailService;
