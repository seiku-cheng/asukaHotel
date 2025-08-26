import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// Create transporter dynamically with database settings
async function createTransporter() {
  const gmailUser = await prisma.settings.findUnique({
    where: { key: 'gmail_user' }
  });

  const gmailPassword = await prisma.settings.findUnique({
    where: { key: 'gmail_app_password' }
  });

  if (!gmailUser?.value || !gmailPassword?.value) {
    throw new Error('Gmail settings not configured. Please configure Gmail settings in admin panel.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser.value,
      pass: gmailPassword.value,
    },
  });
}

interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  bookingId: string;
  roomName: string;
  roomNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  adults: number;
  children?: number;
  infants?: number;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    const transporter = await createTransporter();
    const {
      guestName,
      guestEmail,
      bookingId,
      roomName,
      roomNumber,
      checkInDate,
      checkOutDate,
      totalPrice,
      adults,
      children = 0,
      infants = 0,
    } = data;

    const checkInStr = checkInDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });

    const checkOutStr = checkOutDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });

    const guestCountText = `大人${adults}名` + 
      (children > 0 ? `、子供${children}名` : '') + 
      (infants > 0 ? `、幼児${infants}名` : '');

    // Get Gmail user for from address
    const gmailUser = await prisma.settings.findUnique({
      where: { key: 'gmail_user' }
    });

    const mailOptions = {
      from: {
        name: '箱根仙石原寮',
        address: gmailUser?.value || 'noreply@asuka-hotel.com',
      },
      to: guestEmail,
      subject: `【予約確認】箱根仙石原寮 ご予約承りました（予約番号：${bookingId}）`,
      html: `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>予約確認</title>
          <style>
            body {
              font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f7f4;
            }
            .header {
              background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .booking-details {
              background: #f9f7f4;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #8B4513;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #8B4513;
              min-width: 120px;
            }
            .value {
              color: #333;
              text-align: right;
              flex: 1;
            }
            .price {
              font-size: 18px;
              font-weight: bold;
              color: #8B4513;
            }
            .greeting {
              margin-bottom: 20px;
              font-size: 16px;
            }
            .notice {
              background: #fff8e1;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border: 1px solid #ffecb3;
            }
            .notice h3 {
              color: #f57c00;
              margin: 0 0 10px 0;
              font-size: 14px;
            }
            .notice ul {
              margin: 0;
              padding-left: 20px;
            }
            .notice li {
              font-size: 13px;
              margin-bottom: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 14px;
              color: #666;
            }
            .contact-info {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              margin-top: 20px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>箱根仙石原寮</h1>
            <p>ご予約承りました</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              <p>${guestName} 様</p>
              <p>この度は箱根仙石原寮をご利用いただき、誠にありがとうございます。<br>
              ご予約を確認いたしましたので、詳細をお知らせいたします。</p>
            </div>

            <div class="booking-details">
              <div class="detail-row">
                <span class="label">お客様名</span>
                <span class="value">${guestName} 様</span>
              </div>
              <div class="detail-row">
                <span class="label">予約番号</span>
                <span class="value">${bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="label">お部屋</span>
                <span class="value">${roomName}（${roomNumber}号室）</span>
              </div>
              <div class="detail-row">
                <span class="label">チェックイン</span>
                <span class="value">${checkInStr}</span>
              </div>
              <div class="detail-row">
                <span class="label">チェックアウト</span>
                <span class="value">${checkOutStr}</span>
              </div>
              <div class="detail-row">
                <span class="label">宿泊人数</span>
                <span class="value">${guestCountText}</span>
              </div>
              <div class="detail-row">
                <span class="label">ご宿泊料金</span>
                <span class="value price">¥${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div class="notice">
              <h3>■ ご利用にあたって</h3>
              <ul>
                <li>チェックイン時間：15:00〜22:00</li>
                <li>チェックアウト時間：〜11:00</li>
                <li>お支払いは現地にて現金またはクレジットカードでお願いいたします</li>
                <li>ご不明な点がございましたら、お気軽にお問い合わせください</li>
              </ul>
            </div>

            <p>皆様のお越しを心よりお待ちしております。</p>

            <div class="contact-info">
              <strong>箱根仙石原寮</strong><br>
              お問い合わせ：asuka.hotel@seiku.co.jp<br>
              ※このメールは自動送信されています。返信はできませんのでご了承ください。
            </div>
          </div>

          <div class="footer">
            <p>&copy; 2025 箱根仙石原寮 All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
【予約確認】箱根仙石原寮

${guestName} 様

この度は箱根仙石原寮をご利用いただき、誠にありがとうございます。
ご予約を確認いたしましたので、詳細をお知らせいたします。

■ 予約詳細
お客様名：${guestName} 様
予約番号：${bookingId}
お部屋：${roomName}（${roomNumber}号室）
チェックイン：${checkInStr}
チェックアウト：${checkOutStr}
宿泊人数：${guestCountText}
ご宿泊料金：¥${totalPrice.toLocaleString()}

■ ご利用にあたって
・チェックイン時間：15:00〜22:00
・チェックアウト時間：〜11:00
・お支払いは現地にて現金またはクレジットカードでお願いいたします
・ご不明な点がございましたら、お気軽にお問い合わせください

皆様のお越しを心よりお待ちしております。

箱根仙石原寮
お問い合わせ：asuka.hotel@seiku.co.jp
※このメールは自動送信されています。返信はできませんのでご了承ください。
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
}

export async function verifyEmailConnection() {
  try {
    const transporter = await createTransporter();
    await transporter.verify();
    console.log('Email server connection verified');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
}