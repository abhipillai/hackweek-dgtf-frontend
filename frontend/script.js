async function getQRCode() {
    const amount = document.getElementById('amount').value;

    try {
        const response = await fetch(
            'http://localhost:3000/api/payments',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    amount,
                    currency: "JPY",
                }),
            }
        );

        if (response.status !== 200) {
            throw new Error('backend responded with status ' + response.status);
        }

        const data = await response.json();
        window.open(data.payment.japan_qr_code_details.qr_code_url, '_blank');
        // document.getElementById('qrCodeImage').src = data.payment.japan_qr_code_details.qr_code_url;
        // document.getElementById('qrCodeContainer').style.display = 'block';

        pollPaymentStatus(data.payment.id);
    } catch (error) {
        console.error('Error fetching QR code: ', error);
    }
}

function pollPaymentStatus(paymentId) {
    document.getElementById('paymentStatus').textContent = 'Waiting for buyer';
    document.getElementById('paymentStatusContainer').style.display = 'block';
    const url = `http://localhost:3000/api/payments/${paymentId}`;
    const interval = setInterval(async () => {
        const response = await fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        if (data.payment.status === 'COMPLETED') {
            clearInterval(interval);
            document.getElementById('paymentStatus').textContent = 'Payment Completed';
        }
    }, 5000); // Poll every 5 seconds
}
