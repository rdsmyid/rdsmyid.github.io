// script.js

document.addEventListener('DOMContentLoaded', function() {
    const jumlahAntrianSpan = document.getElementById('jumlah-antrian');
    const showFormBtn = document.getElementById('showFormBtn');
    const registrationForm = document.getElementById('registrationForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');

    // Dapatkan elemen kartu induk (ini yang akan menerima event klik)
    const ourProfilesCard = document.querySelector('.our-profiles-card');
    const paymentMethodCard = document.querySelector('.payment-method-overview');
    const whyRdsCard = document.querySelector('.why-rds-card');

    // Dapatkan elemen detail (ini yang akan di-toggle visibilitasnya)
    const ourProfilesDetails = document.getElementById('our-profiles-details');
    const paymentDetails = document.getElementById('payment-details');
    const whyRdsDetails = document.getElementById('why-rds-details');

    // Dapatkan elemen header (ini yang akan menerima kelas aktif untuk rotasi panah)
    const ourProfilesHeader = document.querySelector('.our-profiles-card .info-card-header');
    const paymentHeader = document.querySelector('.payment-method-overview .info-card-header');
    const whyRdsHeader = document.querySelector('.why-rds-card .info-card-header');

    // URL publik dari Google Apps Script Anda
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyI9YUU2vGAL8Rlch_5lc4Vs8cJgZKGXcAWQz5PfOe0BlXUD8IfmtZv9mT50-NnouKF/exec';

    // Fungsi untuk mengambil jumlah antrian
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
    // Atur interval untuk memperbarui secara berkala setiap 10 detik
    setInterval(fetchJumlahAntrian, 10000);

    // Fungsi toggle yang lebih umum
    // headerElementForArrow adalah elemen yang akan menerima kelas aktif untuk rotasi panah
    function toggleSection(detailsElement, headerElementForArrow, activeClass) {
        if (detailsElement && headerElementForArrow) {
            detailsElement.classList.toggle('hidden');
            headerElementForArrow.classList.toggle(activeClass);
        }
    }

    // Event listener untuk tombol "Masuk Antrian"
    if (showFormBtn) {
        showFormBtn.addEventListener('click', function() {
            registrationForm.classList.remove('hidden'); // Menampilkan formulir
            showFormBtn.style.display = 'none'; // Menyembunyikan tombol
            submissionMessage.classList.add('hidden'); // Memastikan pesan tersembunyi
        });
    }

    // Event listener untuk tombol "Batal" pada formulir
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            registrationForm.classList.add('hidden'); // Menyembunyikan formulir
            showFormBtn.style.display = 'inline-flex'; // Menampilkan kembali tombol
        });
    }

    // Event listener untuk pengiriman formulir
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Periksa apakah reCAPTCHA sudah diselesaikan
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse() !== "") {
                const formData = new FormData(form);
                const action = form.getAttribute('action');

                fetch(action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                }).then(() => {
                    registrationForm.classList.add('hidden');
                    submissionMessage.classList.remove('hidden');
                    showFormBtn.style.display = 'inline-flex';
                    form.reset();
                    if (typeof grecaptcha !== 'undefined') {
                        grecaptcha.reset();
                    }
                    fetchJumlahAntrian();
                }).catch(error => {
                    console.error('Terjadi kesalahan saat mengirim formulir:', error);
                    alert('Terjadi kesalahan saat mengirim formulir. Mohon coba lagi.');
                });
            } else {
                alert('Harap selesaikan reCAPTCHA terlebih dahulu.');
            }
        });
    }

    // Event listener untuk Kategori Akun (seluruh kartu)
    if (ourProfilesCard) {
        ourProfilesCard.addEventListener('click', function() {
            toggleSection(ourProfilesDetails, ourProfilesHeader, 'our-profiles-details-active');
        });
    }

    // Event listener untuk Metode Pembayaran (seluruh kartu)
    if (paymentMethodCard) {
        paymentMethodCard.addEventListener('click', function() {
            toggleSection(paymentDetails, paymentHeader, 'payment-details-active');
        });
    }

    // Event listener untuk Kenapa RDS? (seluruh kartu)
    if (whyRdsCard) {
        whyRdsCard.addEventListener('click', function() {
            toggleSection(whyRdsDetails, whyRdsHeader, 'why-rds-details-active');
        });
    }
});
