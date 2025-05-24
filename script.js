function togglePaymentDetails(id) {
    const details = document.getElementById(id + '-details');
    if (details) {
        details.classList.toggle('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const showFormBtn = document.getElementById('showFormBtn');
    const registrationForm = document.getElementById('registrationForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');

    if (showFormBtn) {
        showFormBtn.addEventListener('click', function() {
            if (registrationForm) {
                registrationForm.classList.add('active');
            }
        });
    }

    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            if (registrationForm) {
                registrationForm.classList.remove('active');
            }
        });
    }

    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            const formData = new FormData(form);
            const action = form.getAttribute('action');

            fetch(action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Untuk mengatasi masalah CORS dengan Google Forms
            }).then(() => {
                if (registrationForm) {
                    registrationForm.classList.remove('active');
                }
                if (submissionMessage) {
                    submissionMessage.style.display = 'block';
                }
                // Reset form setelah berhasil (opsional)
                form.reset();
            }).catch(error => {
                console.error('Error submitting form', error);
                alert('Terjadi kesalahan saat mengirim formulir.');
            });
        });
    }

    // Fungsi untuk memperbarui jumlah antrian (simulasi)
    function updateQueueCount() {
        const jumlahAntrianElement = document.getElementById('jumlah-antrian');
        if (jumlahAntrianElement) {
            // Simulasi data antrian (ganti dengan data sebenarnya jika ada API)
            const randomQueue = Math.floor(Math.random() * 15) + 1;
            jumlahAntrianElement.textContent = randomQueue;
        }
    }

    // Perbarui jumlah antrian setiap beberapa detik (simulasi)
    setInterval(updateQueueCount, 5000);
    updateQueueCount(); // Panggil pertama kali saat halaman dimuat
});
