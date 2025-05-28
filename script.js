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

    // Tambahan: Elemen untuk Kategori Akun dan Detail Permintaan Akun
    const pilihanAkunSelect = document.getElementById('pilihanAkun');
    const requestInputGroup = document.getElementById('requestInputGroup');
    const requestAkunTextarea = document.getElementById('requestAkun');

    // URL publik dari Google Apps Script Anda
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyI9YUU2vGAL8Rlch_5lc4Vs8cJgZKGXcAWQz5PfOe0BlXUD8IfmtZv9mT50-NnouKF/exec';

    // Fungsi untuk mengambil jumlah antrian
    function fetchJumlahAntrian() {
        fetch(scriptURL + '?action=jumlah')
            .then(response => {
                if (!response.ok) { // Check for HTTP errors
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (jumlahAntrianSpan && data && data.jumlah !== undefined && data.total_pesanan !== undefined) {
                    jumlahAntrianSpan.textContent = `${data.jumlah} Orang (${data.total_pesanan} Akun)`;
                } else if (jumlahAntrianSpan) {
                    jumlahAntrianSpan.textContent = 'Data tidak lengkap';
                    console.warn('Fetched data missing expected properties:', data);
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
            showFormBtn.classList.add('hidden'); // Menyembunyikan tombol dengan kelas
            submissionMessage.classList.add('hidden'); // Memastikan pesan tersembunyi
            // Reset dropdown dan sembunyikan input request saat formulir ditampilkan
            if (pilihanAkunSelect) {
                pilihanAkunSelect.value = ''; // Reset ke opsi default
            }
            if (requestInputGroup) {
                requestInputGroup.classList.add('hidden');
                requestAkunTextarea.removeAttribute('required');
                requestAkunTextarea.value = ''; // Kosongkan
            }
        });
    }

    // Event listener untuk tombol "Batal" pada formulir
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            registrationForm.classList.add('hidden'); // Menyembunyikan formulir
            showFormBtn.classList.remove('hidden'); // Menampilkan kembali tombol dengan kelas
            // Reset dropdown dan sembunyikan input request saat formulir disembunyikan
            if (pilihanAkunSelect) {
                pilihanAkunSelect.value = ''; // Reset ke opsi default
            }
            if (requestInputGroup) {
                requestInputGroup.classList.add('hidden');
                requestAkunTextarea.removeAttribute('required');
                requestAkunTextarea.value = ''; // Kosongkan
            }
            // Reset reCAPTCHA juga saat batal
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
            document.getElementById('registrationForm').reset(); // Reset seluruh formulir
        });
    }

    // Event listener untuk pengiriman formulir
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Periksa apakah reCAPTCHA sudah diselesaikan
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse() !== "") {
                // Periksa validasi tambahan untuk "By Request"
                if (pilihanAkunSelect && pilihanAkunSelect.value === 'By_Request' && requestAkunTextarea.value.trim() === '') {
                    alert('Harap isi detail permintaan akun Anda.');
                    return; // Hentikan pengiriman jika kosong
                }

                const formData = new FormData(form);
                const action = form.getAttribute('action');

                fetch(action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                }).then(() => {
                    registrationForm.classList.add('hidden');
                    submissionMessage.classList.remove('hidden');
                    showFormBtn.classList.remove('hidden'); // Menampilkan kembali tombol
                    form.reset(); // Reset formulir
                    // Reset reCAPTCHA
                    if (typeof grecaptcha !== 'undefined') {
                        grecaptcha.reset();
                    }
                    // Reset dropdown dan sembunyikan input request setelah pengiriman berhasil
                    if (pilihanAkunSelect) {
                        pilihanAkunSelect.value = '';
                    }
                    if (requestInputGroup) {
                        requestInputGroup.classList.add('hidden');
                        requestAkunTextarea.removeAttribute('required');
                        requestAkunTextarea.value = '';
                    }
                    fetchJumlahAntrian(); // Perbarui jumlah antrian
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

    // Tambahan: Event listener untuk perubahan pada dropdown Kategori Akun
    if (pilihanAkunSelect) {
        pilihanAkunSelect.addEventListener('change', function() {
            if (this.value === 'By_Request') {
                requestInputGroup.classList.remove('hidden'); // Tampilkan kolom permintaan
                requestAkunTextarea.setAttribute('required', 'true'); // Jadikan wajib diisi
            } else {
                requestInputGroup.classList.add('hidden'); // Sembunyikan kolom permintaan
                requestAkunTextarea.removeAttribute('required'); // Hapus atribut wajib
                requestAkunTextarea.value = ''; // Kosongkan nilainya ketika disembunyikan
            }
        });
    }
});
