// js/registration-form.js

document.addEventListener('DOMContentLoaded', function() {
    const showFormBtn = document.getElementById('showFormBtn');
    const registrationForm = document.getElementById('registrationForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');

    const pilihanAkunSelect = document.getElementById('pilihanAkun');
    const requestInputGroup = document.getElementById('requestInputGroup');
    const requestAkunTextarea = document.getElementById('requestAkun');

    if (showFormBtn) {
        showFormBtn.addEventListener('click', function() {
            if (registrationForm) registrationForm.classList.remove('hidden');
            showFormBtn.classList.add('hidden');
            if (submissionMessage) submissionMessage.classList.add('hidden');
            
            if (pilihanAkunSelect) {
                pilihanAkunSelect.value = '';
            }
            if (requestInputGroup && requestAkunTextarea) {
                requestInputGroup.classList.add('hidden');
                requestAkunTextarea.removeAttribute('required');
                requestAkunTextarea.value = '';
            }
        });
    }

    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            if (registrationForm) {
                registrationForm.classList.add('hidden');
                registrationForm.reset();
            }
            if (showFormBtn) showFormBtn.classList.remove('hidden');
            
            if (pilihanAkunSelect) {
                pilihanAkunSelect.value = '';
            }
            if (requestInputGroup && requestAkunTextarea) {
                requestInputGroup.classList.add('hidden');
                requestAkunTextarea.removeAttribute('required');
                requestAkunTextarea.value = '';
            }
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse() !== "") {
                if (pilihanAkunSelect && pilihanAkunSelect.value === 'By Request' && requestAkunTextarea && requestAkunTextarea.value.trim() === '') {
                    alert('Harap isi detail permintaan akun Anda.');
                    return;
                }

                const formData = new FormData(registrationForm);
                const action = registrationForm.getAttribute('action');

                fetch(action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                }).then(() => {
                    registrationForm.classList.add('hidden');
                    if (submissionMessage) submissionMessage.classList.remove('hidden');
                    if (showFormBtn) showFormBtn.classList.remove('hidden');
                    registrationForm.reset();
                    
                    if (typeof grecaptcha !== 'undefined') {
                        grecaptcha.reset();
                    }
                    if (pilihanAkunSelect) {
                        pilihanAkunSelect.value = '';
                    }
                    if (requestInputGroup && requestAkunTextarea) {
                        requestInputGroup.classList.add('hidden');
                        requestAkunTextarea.removeAttribute('required');
                        requestAkunTextarea.value = '';
                    }
                    
                    // Panggil fetchJumlahAntrian() setelah form berhasil dikirim
                    if (typeof fetchJumlahAntrian === 'function') {
                        fetchJumlahAntrian(); // Memanggil fungsi dari queue-counter.js
                    } else {
                        console.warn('Fungsi fetchJumlahAntrian tidak ditemukan untuk dipanggil setelah submit.');
                    }

                }).catch(error => {
                    console.error('Terjadi kesalahan saat mengirim formulir:', error);
                    alert('Terjadi kesalahan saat mengirim formulir. Mohon coba lagi.');
                });
            } else {
                alert('Harap selesaikan reCAPTCHA terlebih dahulu.');
            }
        });
    }

    if (pilihanAkunSelect) {
        pilihanAkunSelect.addEventListener('change', function() {
            if (requestInputGroup && requestAkunTextarea) {
                if (this.value === 'By Request') {
                    requestInputGroup.classList.remove('hidden');
                    requestAkunTextarea.setAttribute('required', 'true');
                } else {
                    requestInputGroup.classList.add('hidden');
                    requestAkunTextarea.removeAttribute('required');
                    requestAkunTextarea.value = '';
                }
            }
        });
    }
});
