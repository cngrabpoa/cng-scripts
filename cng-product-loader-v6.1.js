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

    // Inject Styles Automatically
    if (!document.getElementById('cng-ultra-v6-styles')) {
        const css = `
            .ultra-luxury-card { font-family: 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; max-width: 800px; margin: 30px auto; padding: 45px; background: linear-gradient(145deg, #131c2e, #020617); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6); line-height: 1.8; }
            .premium-img-wrap { text-align: center; margin-bottom: 40px; }
            .premium-img-wrap img { border-radius: 20px; width: 100%; height: auto; max-width: 320px; border: 1px solid rgba(56, 189, 248, 0.2); transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4); cursor: pointer; }
            .premium-img-wrap img:hover { transform: translateY(-12px) scale(1.03); box-shadow: 0 25px 50px rgba(56, 189, 248, 0.25); border: 1px solid rgba(56, 189, 248, 0.5); }
            .luxury-title { font-size: 32px; font-weight: 800; text-align: center; background: linear-gradient(to right, #ffffff, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 25px; }
            .section-header { font-size: 20px; font-weight: 700; color: #38bdf8; margin-top: 35px; border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding-bottom: 8px; display: block; }
            .luxury-list-ui { list-style: none !important; padding: 0 !important; margin: 15px 0 !important; }
            .luxury-list-ui li { position: relative; padding-left: 28px !important; margin-bottom: 12px; color: #94a3b8; }
            .luxury-list-ui li::before { content: "✦"; position: absolute; left: 0; color: #38bdf8; font-weight: bold; }
            .luxury-btn { display: inline-block; padding: 18px 45px; background: #38bdf8; color: #020617 !important; font-weight: 800; text-transform: uppercase; text-decoration: none !important; border-radius: 50px; transition: 0.3s; margin: 20px 0; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.3); text-align: center; }
            .luxury-btn:hover { transform: translateY(-4px); background: #7dd3fc; }
            .safety-box { background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); padding: 15px; border-radius: 12px; margin: 20px 0; color: #fb7185; font-weight: 600; text-align: center; }
            .material-box { background: rgba(56, 189, 248, 0.03); padding: 20px; border-radius: 15px; border: 1px dashed rgba(56, 189, 248, 0.3); margin: 25px 0; font-style: italic; color: #cbd5e1; }
            .faq-accordion-container { margin-top: 20px; }
            .faq-accordion-item { background: rgba(255, 255, 255, 0.03); border-radius: 15px; margin-bottom: 15px; overflow: hidden; border: 1px solid rgba(56, 189, 248, 0.1); cursor: pointer; transition: all 0.3s ease; }
            .faq-accordion-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 25px; }
            .faq-accordion-header .faq-q { color: #ffffff; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
            .faq-accordion-icon { color: #38bdf8; font-size: 22px; font-weight: bold; transition: transform 0.4s ease; }
            .faq-accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease-out, padding 0.4s ease-out; padding: 0 25px; }
            .faq-accordion-item.active .faq-accordion-content { max-height: 500px; padding-bottom: 25px; }
            .faq-accordion-item.active .faq-accordion-icon { transform: rotate(45deg); }
            .premium-photo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 30px 0; }
            .grid-item { overflow: hidden; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.2); transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); cursor: pointer; }
            .grid-item img { width: 100%; height: auto; aspect-ratio: 1 / 1; object-fit: cover; display: block; transition: all 0.5s ease; }
            .grid-item:hover { transform: translateY(-8px); border-color: #38bdf8; box-shadow: 0 15px 30px rgba(56, 189, 248, 0.3); }
            #lb-overlay { display: none; position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px); flex-direction: column; align-items: center; justify-content: center; }
            #lb-container { position: relative; max-width: 90%; display: flex; flex-direction: column; align-items: center; }
            #lb-img { max-width: 100%; max-height: 70vh; border-radius: 10px; border: 2px solid rgba(56, 189, 248, 0.3); margin-bottom: 20px; }
            .lb-close { position: absolute; top: -50px; right: 0; color: white; font-size: 40px; cursor: pointer; }
            .lb-btn { position: absolute; top: 40%; transform: translateY(-50%); background: rgba(56, 189, 248, 0.2); color: white; border: none; padding: 15px; cursor: pointer; font-size: 24px; border-radius: 50%; }
            .lb-prev { left: -70px; } .lb-next { right: -70px; }
            #lb-thumbs-box { display: flex; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow-x: auto; width: 100%; justify-content: center; }
            .lb-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 5px; cursor: pointer; border: 2px solid transparent; opacity: 0.6; }
            .lb-thumb.active { border-color: #38bdf8; opacity: 1; }
            @media (max-width: 600px) { .premium-photo-grid { grid-template-columns: repeat(2, 1fr); } .lb-btn { display: none; } }
        `;
        const s = document.createElement('style'); s.id = 'cng-ultra-v6-styles'; s.innerHTML = css; document.head.appendChild(s);
    }

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
            const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^\"$]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
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
