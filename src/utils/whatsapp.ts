export const generateWhatsAppBillUrl = (
    phone: string,
    customerName: string,
    stationName: string,
    duration: string,
    cost: number,
    paymentMethod: string,
    sessionId: string
) => {

    // Clean phone number: remove non-digits and ensure it starts with 91 (India) if needed
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
    }

    const baseUrl = window.location.origin;
    const reportUrl = `${baseUrl}/report.aspx?id=${sessionId}`;

    const message = `*GAMING CAFE RECEIPT* 🎮
--------------------------
*Customer:* ${customerName}
*Station:* ${stationName}
*Duration:* ${duration}
*Total Cost:* ₹${cost}
*Payment:* ${paymentMethod.toUpperCase()}

*Download Bill/PDF:*
${reportUrl}

Thank you for playing! ✨`;


    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}/?text=${encodedMessage}`;
};
