// script.js

document.addEventListener('DOMContentLoaded', function() {
    const jumlahAntrianSpan = document.getElementById('jumlah-antrian');
    const showFormBtn = document.getElementById('showFormBtn');
    const registrationForm = document.getElementById('registrationForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');
    const paymentOverview = document.querySelector('.payment-method-overview');
    const paymentDetails = document.getElementById('payment-details');
    const whyRdsCard = document.querySelector('.why-rds-card');
    const whyRdsDetails = document.getElementById('why-rds-details');
    const whyRdsOverview = document.querySelector('.why-rds-overview');

    // URL publik dari Google Apps Script Anda
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyI9YUU2vGAL8Rlch_5lc4Vs8cJgZKGXcAWQz5PfOe0BlXUD8IfmtZv9mT50-NnouKF/exec';

    function fetchJumlahAntrian() {
        fetch(scriptURL + '?action=jumlah')
            .then(response => response.json())
            .then(data => {
                if (jumlahAntrianSpan && data && data.jumlah !== undefined && data.total_pesanan !== undefined) {
                    jumlahAntrianSpan.textContent = `${data.jumlah} Orang (${data.total_pesanan} Akun)`;
                } else if (jumlahAntrianSpan) {
                    jumlahAntrianSpan.textContent = 'Gagal memuat';
                }
            })
            .catch(error => {
                console.error('Gagal mengambil data antrian:', error);
                if (jumlahAntrianSpan) {
                    jumlahAntrianSpan.textContent = 'Gagal memuat';
                }
            });
    }

    // Panggil fetchJumlahAntrian saat halaman dimuat
    fetchJumlahAntrian();
    // Anda bisa mengatur interval untuk memperbarui secara berkala jika diinginkan
    setInterval(fetchJumlahAntrian, 10000); // Perbarui setiap 10 detik

    window.togglePaymentDetails = function(id) {
        const details = document.getElementById(id + '-details');
        const overview = document.querySelector(`.${id}-method-overview`);

        if (details) {
            details.classList.toggle('active');
            if (overview) {
                overview.classList.toggle('payment-details-active');
            } else if (paymentOverview) {
                paymentOverview.classList.toggle('payment-details-active');
            }
        }
    };

    if (showFormBtn) {
        showFormBtn.addEventListener('click', function() {
            registrationForm.classList.add('active');
            showFormBtn.style.display = 'none';
            submissionMessage.style.display = 'none';
        });
    }

    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            registrationForm.classList.remove('active');
            showFormBtn.style.display = 'inline-flex';
        });
    }

    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Periksa apakah objek grecaptcha tersedia dan getResponse tidak kosong
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse() !== "") {
                const formData = new FormData(form);
                const action = form.getAttribute('action');

                fetch(action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                }).then(() => {
                    if (registrationForm) {
                        registrationForm.classList.remove('active');
                    }
                    if (submissionMessage) {
                        submissionMessage.style.display = 'block';
                    }
                    if (showFormBtn) {
                        showFormBtn.style.display = 'inline-flex';
                    }
                    form.reset();
                    if (typeof grecaptcha !== 'undefined') {
                        const recaptchaElement = document.querySelector('.g-recaptcha');
                        if (recaptchaElement) {
                            const widgetId = grecaptcha.render(recaptchaElement, {
                                'sitekey' : '6LcYkkUrAAAAAJ56YJX5gXSM_Dgy9cOBfItAWeX2'
                            });
                            grecaptcha.reset(widgetId);
                        }
                    }
                    // Setelah berhasil mengirim, perbarui jumlah antrian
                    fetchJumlahAntrian();
                }).catch(error => {
                    console.error('Terjadi kesalahan saat mengirim formulir:', error);
                    // alert('Terjadi kesalahan saat mengirim formulir.');
                });
            } else {
                // Jika reCAPTCHA belum diselesaikan, tampilkan pesan atau cegah pengiriman
                alert('Harap selesaikan reCAPTCHA terlebih dahulu.');
            }
        });
    }

    window.toggleWhyRDS = function() {
        if (whyRdsDetails && whyRdsOverview) {
            whyRdsDetails.style.display = whyRdsDetails.style.display === 'none' ? 'block' : 'none';
            whyRdsOverview.classList.toggle('why-rds-details-active');
        }
    };

    if (whyRdsCard) {
        whyRdsCard.addEventListener('click', toggleWhyRDS);
    }
});
