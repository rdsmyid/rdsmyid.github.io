document.addEventListener('DOMContentLoaded', () => {

    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            document.body.classList.toggle('mobile-nav-open');
        });
    }
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (link.getAttribute('href').startsWith('#')) {
                document.body.classList.remove('mobile-nav-open');
            }
        });
    });

    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    
    const tipItems = document.querySelectorAll('.tip-item');
    tipItems.forEach(item => {
        const header = item.querySelector('.tip-header');
        const content = item.querySelector('.tip-content');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            tipItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.tip-content').style.maxHeight = null;
                }
            });
            if (!isActive) { item.classList.add('active'); content.style.maxHeight = content.scrollHeight + 'px'; } 
            else { item.classList.remove('active'); content.style.maxHeight = null; }
        });
    });

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTyTZk9BzMtK2GF7r4zmDUJbY-TPMcLw-7TH3qs381bRaqaT9oq6e-b9w2Vr4MM8Y9xk-TSZS7JFYBv/pub?output=csv';
    const loadingDiv = document.getElementById('loading');
    const accordionContainer = document.getElementById('accordion-container');
    function formatPriceWithK(priceString) { if (!priceString) return ''; const n = parseInt(priceString.replace(/\D/g, ''), 10); if (isNaN(n)) { return priceString; } const f = n.toLocaleString('id-ID'); let p = f; if (n >= 1000) { p += ` / ${n/1000}K`; } return p; }
    function isUrl(str) { if (!str) return false; return str.toLowerCase().startsWith('http://') || str.toLowerCase().startsWith('https://'); }
    function setupAccordionListeners() { const h = document.querySelectorAll('#accordion-container .accordion-header.clickable'); h.forEach(header => { header.addEventListener('click', () => { const p = header.nextElementSibling; const a = p.style.maxHeight && p.style.maxHeight !== '0px'; document.querySelectorAll('#accordion-container .accordion-panel').forEach(i => { i.style.maxHeight = null; }); if (!a) { p.style.maxHeight = p.scrollHeight + "px"; } }); }); }
    fetch(sheetUrl).then(res => res.ok ? res.text() : Promise.reject(res.statusText)).then(csv => {
        loadingDiv.style.display = 'none';
        const order = ["F100", "F200", "F300", "F500", "F1000"];
        const rows = csv.trim().split('\n').slice(1);
        const data = {};
        rows.forEach(row => { let [k, l, h] = row.split(','); k = (k || '').trim(); l = (l || '').trim(); h = (h || '').trim(); if (k && l) { if (!data[k]) data[k] = []; data[k].push({ link: l, harga: h }); } });
        order.forEach(k => {
            const div = document.createElement('div'); div.className = 'accordion-item'; const items = data[k] || [];
            if (items.length > 0) {
                const list = items.map(item => { const hasLink = isUrl(item.link); const btn = hasLink ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="copy-btn">Buka</a>` : ''; return `<li class="link-item"><div class="link-details"><span class="link-text" title="${item.link}">${item.link}</span><span class="link-price">Rp ${formatPriceWithK(item.harga)}</span></div>${btn}</li>`; }).join('');
                div.innerHTML = `<button class="accordion-header clickable"><span class="category-name">${k}</span><span class="stock-count available">${items.length} Tersedia</span></button><div class="accordion-panel"><ul class="link-list">${list}</ul></div>`;
            } else {
                div.innerHTML = `<div class="accordion-header empty"><span class="category-name">${k}</span><span class="stock-count empty">Stok Kosong</span></div>`;
            }
            accordionContainer.appendChild(div);
        });
        setupAccordionListeners();
    }).catch(err => { loadingDiv.innerText = 'Terjadi kesalahan saat memuat data stok.'; console.error('Error:', err); });
});
