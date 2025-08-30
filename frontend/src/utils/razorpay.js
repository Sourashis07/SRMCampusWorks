import axios from 'axios';

export const initiatePayment = async (taskId, amount) => {
  try {
    // Create order
    const orderResponse = await axios.post('http://localhost:5000/api/payments/create-order', {
      taskId,
      amount
    });

    const { orderId } = orderResponse.data;

    // Razorpay options
    const options = {
      key: 'your-razorpay-key-id', // Replace with your Razorpay key
      amount: amount * 100,
      currency: 'INR',
      name: 'CampusFreelance',
      description: 'Task Payment',
      order_id: orderId,
      handler: async (response) => {
        // Verify payment
        try {
          await axios.post('http://localhost:5000/api/payments/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          
          alert('Payment successful!');
          window.location.reload();
        } catch (error) {
          alert('Payment verification failed');
        }
      },
      prefill: {
        name: 'Student Name',
        email: 'student@srmist.edu.in'
      },
      theme: {
        color: '#3B82F6'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    alert('Payment initiation failed');
  }
};

export const releasePayment = async (taskId) => {
  try {
    await axios.post('http://localhost:5000/api/payments/release-payment', {
      taskId
    });
    alert('Payment released successfully!');
  } catch (error) {
    alert('Failed to release payment');
  }
};