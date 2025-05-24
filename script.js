document.addEventListener('DOMContentLoaded', function() {
    const paymentOverview = document.querySelector('.payment-method-overview');
    const paymentDetails = document.getElementById('payment-details');
    const dropdownArrow = document.getElementById('dropdown-arrow');

    if (paymentOverview && paymentDetails && dropdownArrow) {
        paymentOverview.addEventListener('click', function() {
            paymentDetails.classList.toggle('active');
            // Putar panah berdasarkan status active
            if (paymentDetails.classList.contains('active')) {
                dropdownArrow.style.transform = 'translateX(-50%) rotate(180deg)';
            } else {
                dropdownArrow.style.transform = 'translateX(-50%) rotate(0deg)';
            }
        });
    }

    const joinQueueButton = document.querySelector('.join-queue-button');
    const registrationForm = document.getElementById('registrationForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');
    const registrationSubmitForm = document.getElementById('registrationSubmitForm');

    if (joinQueueButton) {
        joinQueueButton.addEventListener('click', function(e) {
            e.preventDefault();
            registrationForm.classList.add('active');
        });
    }

    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            registrationForm.classList.remove('active');
        });
    }

    if (registrationSubmitForm) {
        registrationSubmitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registrationForm.classList.remove('active');
            submissionMessage.classList.add('active');
            setTimeout(function() {
                submissionMessage.classList.remove('active');
            }, 3000); // Tampilkan pesan sukses selama 3 detik
            // Di sini Anda bisa menambahkan logika pengiriman data formulir
            console.log('Formulir didaftarkan!');
        });
    }
});
