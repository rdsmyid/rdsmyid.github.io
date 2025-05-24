document.addEventListener('DOMContentLoaded', function() {
    const paymentOverview = document.querySelector('.payment-method-overview');
    const paymentDetails = document.getElementById('payment-details');
    const showFormBtn = document.getElementById('showFormBtn');
    const registrationForm = document.getElementById('registrationForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');
    const jumlahAntrianSpan = document.getElementById('jumlah-antrian');
    const paymentOverviewArrow = paymentOverview ? paymentOverview.querySelector('::after') : null;

    // Fungsi untuk menampilkan/menyembunyikan detail pembayaran
    window.togglePaymentDetails = function(id) {
        const details = document.getElementById(id + '-details');
        const overview = document.querySelector(`.${id}-method-overview`);
        const arrow = overview ? overview.querySelector('::after') : null;

        if (details) {
            details.classList.toggle('active');
            if (arrow) {
                const isOpen = details.classList.contains('active');
                overview.style.setProperty('--arrow-direction', isOpen ? '"\\25B2"' : '"\\25BE"');
            }
        } else if (id === 'payment') {
            paymentDetails.classList.toggle('active');
            if (paymentOverviewArrow) {
                const isOpen = paymentDetails.classList.contains('active');
                paymentOverview.style.setProperty('--arrow-direction', isOpen ? '"\\25B2"' : '"\\25BE"');
            }
        }
    };

    // Set initial arrow direction using CSS variable
    if (paymentOverview) {
        paymentOverview.style.setProperty('--arrow-direction', '"\\25BE"');
    }

    // Event listener untuk tombol "Masuk Antrian"
    if (showFormBtn) {
        showFormBtn.addEventListener('click', function() {
            registrationForm.classList.add('active');
            showFormBtn.style.display = 'none';
            submissionMessage.style.display = 'none'; // Pastikan pesan sukses tersembunyi saat formulir ditampilkan
        });
    }

    // Event listener untuk tombol "Batal" pada formulir
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            registrationForm.classList.remove('active');
            showFormBtn.style.display = 'inline-flex';
        });
    }

    // Event listener untuk form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function() {
            // Sembunyikan formulir dan tombol masuk antrian
            registrationForm.classList.remove('active');
            showFormBtn.style.display = 'none';
            // Tampilkan pesan sukses
            submissionMessage.style.display = 'block';
            // Anda mungkin ingin mencegah pengiriman form yang sebenarnya di sini
            // jika Anda ingin menangani pengiriman melalui JavaScript.
            // event.preventDefault();
        });
    }

    // Fungsi untuk memperbarui jumlah antrian (simulasi)
    function updateJumlahAntrian() {
        const randomAntrian = Math.floor(Math.random() * 15) + 5; // Contoh angka acak antara 5 dan 19
        if (jumlahAntrianSpan) {
            jumlahAntrianSpan.textContent = randomAntrian;
        }
    }

    // Perbarui jumlah antrian setiap beberapa detik (opsional)
    setInterval(updateJumlahAntrian, 5000);

    // Inisialisasi jumlah antrian saat halaman dimuat
    updateJumlahAntrian();
});
