// script.js

document.addEventListener('DOMContentLoaded', function() {
    const jumlahAntrianSpan = document.getElementById('jumlah-antrian');
    const showFormBtn = document.getElementById('showFormBtn');
    const registrationForm = document.getElementById('registrationForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');

    // Dapatkan elemen header yang akan diklik (toggle triggers)
    const ourProfilesHeader = document.querySelector('.our-profiles-card .info-card-header');
    const ourProfilesDetails = document.getElementById('our-profiles-details');

    const paymentHeader = document.querySelector('.payment-method-overview .info-card-header');
    const paymentDetails = document.getElementById('payment-details');

    const whyRdsHeader = document.querySelector('.why-rds-card .info-card-header');
    const whyRdsDetails = document.getElementById('why-rds-details');

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
    function toggleSection(headerElement, detailsElement, activeClass) {
        if (headerElement && detailsElement) {
            // Mengelola visibilitas dengan menambahkan/menghapus kelas 'hidden'
            detailsElement.classList.toggle('hidden');
            // Mengelola rotasi panah dengan menambahkan/menghapus kelas aktif pada elemen header
            headerElement.classList.toggle(activeClass);
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
                    mode: 'no-cors' // Penting untuk formulir Google Forms
                }).then(() => {
                    // Setelah berhasil mengirim
                    registrationForm.classList.add('hidden'); // Menyembunyikan formulir
                    submissionMessage.classList.remove('hidden'); // Menampilkan pesan sukses
                    showFormBtn.style.display = 'inline-flex'; // Menampilkan kembali tombol
                    form.reset(); // Mereset formulir
                    if (typeof grecaptcha !== 'undefined') {
                        grecaptcha.reset(); // Mereset reCAPTCHA
                    }
                    // Setelah berhasil mengirim, perbarui jumlah antrian
                    fetchJumlahAntrian();
                }).catch(error => {
                    console.error('Terjadi kesalahan saat mengirim formulir:', error);
                    alert('Terjadi kesalahan saat mengirim formulir. Mohon coba lagi.'); // Atau tampilkan pesan yang lebih user-friendly di DOM
                });
            } else {
                // Jika reCAPTCHA belum diselesaikan
                alert('Harap selesaikan reCAPTCHA terlebih dahulu.');
            }
        });
    }

    // Event listener untuk Kategori Akun
    if (ourProfilesHeader) {
        ourProfilesHeader.addEventListener('click', function() {
            toggleSection(ourProfilesHeader, ourProfilesDetails, 'our-profiles-details-active');
        });
    }

    // Event listener untuk Metode Pembayaran
    if (paymentHeader) {
        paymentHeader.addEventListener('click', function() {
            toggleSection(paymentHeader, paymentDetails, 'payment-details-active');
        });
    }

    // Event listener untuk Kenapa RDS?
    if (whyRdsHeader) {
        whyRdsHeader.addEventListener('click', function() {
            toggleSection(whyRdsHeader, whyRdsDetails, 'why-rds-details-active');
        });
    }
});
