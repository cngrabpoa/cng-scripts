window.toggleFAQ = (element) => element.parentElement.classList.toggle('active');

function renderRelatedPosts(data) {
    if (!data || data === "/i" || data.trim() === "") return "";
    
    const items = data.split('|');
    let listHTML = `<div class="section-header">Related Posts</div><ul class="luxury-list-ui">`;
    
    items.forEach(item => {
        if (item.includes('#')) {
            const [title, url] = item.split('#');
            listHTML += `<li><a href="${url.trim()}" alt="${title.trim()}" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 600;">${title.trim()}</a></li>`;
        }
    });
    
    return listHTML + `</ul>`;
}

async function loadUltraProduct(pid) {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzdDxPhWEqI7Kwy6w8yb-BVipYp34HX-LPzTxMEwLjEh_cC5Z1X4tXOodZ0IxJRN9aZydBt2oKkA8r/pub?gid=647691696&single=true&output=csv";

    if (!document.getElementById('lb-overlay')) {
        document.body.insertAdjacentHTML('beforeend', `<div id="lb-overlay" onclick="window.closeLB()"><div id="lb-container" onclick="event.stopPropagation()"><span class="lb-close" onclick="window.closeLB()">&times;</span><button class="lb-btn lb-prev" onclick="window.changeImg(-1)">&#10094;</button><img id="lb-img" src=""><button class="lb-btn lb-next" onclick="window.changeImg(1)">&#10095;</button><div id="lb-thumbs-box"></div></div></div>`);
    }

    window.galleryImgs = []; window.currentIndex = 0;
    window.closeLB = () => document.getElementById('lb-overlay').style.display = 'none';
    window.updateLB = () => {
        document.getElementById('lb-img').src = window.galleryImgs[window.currentIndex];
        document.getElementById('lb-thumbs-box').innerHTML = window.galleryImgs.map((img, i) => `<img src="${img}" class="lb-thumb ${i===window.currentIndex?'active':''}" onclick="window.currentIndex=${i};window.updateLB()">`).join('');
    };
    window.openLB = (idx) => { window.currentIndex = idx; window.updateLB(); document.getElementById('lb-overlay').style.display = 'flex'; };
    window.changeImg = (n) => { window.currentIndex = (window.currentIndex + n + window.galleryImgs.length) % window.galleryImgs.length; window.updateLB(); };

    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const rows = text.split(/\r?\n/);
        const row = rows.find(r => r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)[1]?.replace(/"/g, '').trim() === pid);

        if (row) {
            const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
            const p = { 
                title: c[2], intro: c[3], hero: c[5], ebay: c[10], feat: c[11], spec: c[12], pack: c[13], 
                gall: c[14], manual: c[15], sBox: c[16], sInfo: c[17], ideal: c[18], tag: c[19],
                deepDive: c[20], faq: c[21], related: c[22] 
            };

            if (p.gall && p.gall !== "/i") window.galleryImgs = p.gall.split('|').map(i => i.trim());

            let html = `<div class="ultra-luxury-card">
                <div class="premium-img-wrap"><a href="${p.ebay}" target="_blank"><img src="${p.hero}"></a></div>
                <h1 class="luxury-title">${p.title}</h1>
                <p style="text-align:center; color:#94a3b8;">${p.intro}</p>
                <div style="text-align:center;"><a href="${p.ebay}" class="luxury-btn" target="_blank">Shop Now on eBay</a></div>
                ${renderSection("Key Features", p.feat)}
                ${renderSection("Specifications", p.spec)}
                ${renderSection("Package Content", p.pack)}
                <div id="gallery-area"></div>
                ${renderSection("User Manual", p.manual)}
                ${p.sBox && p.sBox !== "/i" ? `<div class="safety-box">⚠️ ${p.sBox}</div>` : ''}
                ${renderSection("Safety Information", p.sInfo)}
                ${renderAccordionFAQ(p.faq)}
                ${p.deepDive && p.deepDive !== "/i" ? `<div class="section-header">Material Deep Dive</div><div class="material-box">${p.deepDive}</div>` : ''}
                ${renderSection("Ideal For", p.ideal, "color:#4ade80;")}
                <p style="text-align: center; margin-top: 40px; font-size: 14px; color: #64748b; font-style: italic;">${p.tag}</p>
                <div style="text-align:center; margin: 40px 0;"><a href="${p.ebay}" class="luxury-btn" style="box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);" target="_blank">BUY IT NOW</a></div>
                
                ${renderRelatedPosts(p.related)}
            </div>`;

            document.getElementById('master-luxury-root').innerHTML = html;
            if (window.galleryImgs.length > 0) {
                let gHTML = '<div class="section-header">Product Gallery</div><div class="premium-photo-grid">';
                window.galleryImgs.forEach((img, idx) => gHTML += `<div class="grid-item" onclick="window.openLB(${idx})"><img src="${img}"></div>`);
                document.getElementById('gallery-area').innerHTML = gHTML + '</div>';
            }
        }
    } catch (e) { console.error(e); }
}

function renderSection(t, d, s="") {
    if (!d || d === "/i" || d.trim() === "") return "";
    const listItems = d.split('|').map(i => `<li>${i.trim()}</li>`).join('');
    return `<div class="section-header" style="${s}">${t}</div><ul class="luxury-list-ui">${listItems}</ul>`;
}

function renderAccordionFAQ(faqStr) {
    if (!faqStr || faqStr === "/i" || faqStr.trim() === "") return "";
    const parts = faqStr.split('|');
    let faqHTML = '<div class="section-header">FAQs</div><div class="faq-accordion-container">';
    for (let i = 0; i < parts.length; i += 2) {
        if (parts[i] && parts[i+1]) {
            faqHTML += `<div class="faq-accordion-item"><div class="faq-accordion-header" onclick="window.toggleFAQ(this)"><p class="faq-q">${parts[i].trim()}</p><span class="faq-accordion-icon">+</span></div><div class="faq-accordion-content"><p class="faq-a" style="margin: 0;">${parts[i+1].trim()}</p></div></div>`;
        }
    }
    return faqHTML + '</div>';
}