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

    // Sembunyikan formulir dan pesan saat halaman pertama kali dimuat
    if (registrationForm) {
        registrationForm.style.display = 'none';
    }
    if (submissionMessage) {
        submissionMessage.style.display = 'none';
    }

    if (showFormBtn) {
        showFormBtn.addEventListener('click', () => {
            if (showFormBtn) {
                showFormBtn.style.display = 'none';
            }
            if (registrationForm) {
                registrationForm.style.display = 'block';
            }
        });
    }

    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => {
            if (registrationForm) {
                registrationForm.style.display = 'none';
            }
            if (showFormBtn) {
                showFormBtn.style.display = 'inline-flex';
            }
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse() === "") {
                event.preventDefault();
                alert("Harap selesaikan verifikasi 'Saya bukan robot'.");
                return;
            }

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
                if (registrationForm) {
                    registrationForm.style.display = 'none';
                    registrationForm.reset();
                }
                if (submissionMessage) {
                    submissionMessage.style.display = 'block';
                }
                if (showFormBtn) {
                    showFormBtn.style.display = 'inline-flex';
                }
            })
            .catch(error => {
                console.error('Terjadi kesalahan saat mengirim data:', error);
                alert('Terjadi kesalahan saat mengirim formulir.');
            });
        });
    }
});
