function togglePaymentDetails(method) {
    const detailsDiv = document.getElementById(`${method}-details`);
    if (detailsDiv) {
        detailsDiv.classList.toggle('active');
    }
}

// Ambil data jumlah antrian
fetch("https://script.google.com/macros/s/AKfycbwSsNij1w0vFB9VD77294mgpFNQkbiL-f2SyCCmoO7wUYxEhCP-OUv5XhKoqjtG2L8/exec?action=json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("jumlah-antrian").innerText = data.jumlah;
    })
    .catch(() => {
        document.getElementById("jumlah-antrian").innerText = "Gagal Memuat";
    });

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const showFormBtn = document.getElementById('showFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const joinQueueCard = document.querySelector('.join-queue-card'); // Ambil elemen card bergabung antrian

    // Sembunyikan formulir dan pesan saat halaman pertama kali dimuat
    registrationForm.style.display = 'none';
    submissionMessage.style.display = 'none';

    showFormBtn.addEventListener('click', () => {
        showFormBtn.style.display = 'none';
        registrationForm.style.display = 'block';
    });

    cancelFormBtn.addEventListener('click', () => {
        registrationForm.style.display = 'none';
        showFormBtn.style.display = 'inline-flex';
    });

    registrationForm.addEventListener('submit', function(event) {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse() === "") {
            event.preventDefault();
            alert("Harap selesaikan verifikasi 'Saya bukan robot'.");
            return;
        }

        // Jika reCAPTCHA sudah diselesaikan atau objek grecaptcha tidak ada,
        // biarkan formulir dikirim
        const formData = new FormData(registrationForm);
        const params = new URLSearchParams();
        formData.forEach((value, key) => {
            params.append(key, value);
        });

        const googleFormActionURL = "https://docs.google.com/forms/d/e/1FAIpQLSeoOoBcyIHwty6FsXmmpOQ4vk0urHJkgP4xyR1jEoia_uCURA/formResponse";

        fetch(googleFormActionURL, {
            method: 'POST',
            mode: 'no-cors',
            body: params,
        })
        .then(response => {
            console.log('Data berhasil dikirim (no-cors):', response);
            registrationForm.style.display = 'none';
            submissionMessage.style.display = 'block';
            showFormBtn.style.display = 'inline-flex';
            registrationForm.reset();
        })
        .catch(error => {
            console.error('Terjadi kesalahan saat mengirim data:', error);
            alert('Terjadi kesalahan saat mengirim formulir.');
        });
    });

    // Tambahkan efek klik pada card Bergabung di Antrian
    if (joinQueueCard) {
        joinQueueCard.addEventListener('click', () => {
            const currentTransform = joinQueueCard.style.transform;
            joinQueueCard.style.transform = 'translateY(0)';
            setTimeout(() => {
                joinQueueCard.style.transform = currentTransform;
            }, 100); // Efek sebentar
            // Anda bisa menambahkan logika lain di sini jika perlu
        });
    }
});
