(function() {
    const css = `
        #master-luxury-root { all: initial; font-family: 'Segoe UI', sans-serif; }
        .ultra-luxury-card { background: linear-gradient(145deg, #131c2e, #020617) !important; color: #e2e8f0 !important; max-width: 800px !important; margin: 30px auto !important; padding: 45px !important; border-radius: 30px !important; border: 1px solid rgba(255, 255, 255, 0.05) !important; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6) !important; line-height: 1.8 !important; display: block !important; }
        .premium-img-wrap { text-align: center !important; margin-bottom: 40px !important; }
        .premium-img-wrap img { border-radius: 20px !important; width: 100% !important; max-width: 320px !important; border: 1px solid rgba(56, 189, 248, 0.2) !important; cursor: pointer !important; }
        .luxury-title { font-size: 32px !important; font-weight: 800 !important; text-align: center !important; color: #ffffff !important; margin-bottom: 25px !important; background: linear-gradient(to right, #ffffff, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .section-header { font-size: 20px !important; font-weight: 700 !important; color: #38bdf8 !important; margin-top: 35px !important; border-bottom: 1px solid rgba(56, 189, 248, 0.2) !important; padding-bottom: 8px !important; display: block !important; }
        .luxury-list-ui { list-style: none !important; padding: 0 !important; margin: 15px 0 !important; }
        .luxury-list-ui li { position: relative !important; padding-left: 28px !important; margin-bottom: 12px !important; color: #94a3b8 !important; }
        .luxury-list-ui li::before { content: "✦" !important; position: absolute !important; left: 0 !important; color: #38bdf8 !important; }
        .luxury-btn { display: inline-block !important; padding: 16px 40px !important; background: #38bdf8 !important; color: #020617 !important; font-weight: 800 !important; text-decoration: none !important; border-radius: 50px !important; margin: 20px 0 !important; }
        .premium-photo-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 15px !important; margin: 30px 0 !important; }
        .grid-item img { width: 100% !important; height: 160px !important; object-fit: cover !important; border-radius: 12px !important; border: 1px solid rgba(56, 189, 248, 0.2) !important; }
        #lb-overlay { display: none; position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); flex-direction: column; align-items: center; justify-content: center; }
        .safety-box { background: rgba(225, 29, 72, 0.1) !important; border: 1px solid rgba(225, 29, 72, 0.3) !important; padding: 15px !important; border-radius: 12px !important; color: #fb7185 !important; text-align: center !important; }
    `;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);

    const lbHTML = `<div id="lb-overlay" onclick="this.style.display='none'"><img id="lb-img" style="max-width:90%; max-height:80vh; border-radius:10px;"><div style="color:white; margin-top:15px;">Click anywhere to close</div></div>`;
    document.body.insertAdjacentHTML('beforeend', lbHTML);
})();

let galleryImgs = [];
async function loadUltraProduct(pid) {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzdDxPhWEqI7Kwy6w8yb-BVipYp34HX-LPzTxMEwLjEh_cC5Z1X4tXOodZ0IxJRN9aZydBt2oKkA8r/pub?gid=647691696&single=true&output=csv";
    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const rows = text.split(/\r?\n/);
        const row = rows.find(r => r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)[1]?.replace(/"/g, '').trim() === pid);
        if (row) {
            const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^\" ]*$)/).map(v => v.replace(/"/g, '').trim());
            const p = { title: c[2], intro: c[3], hero: c[5], ebay: c[10], feat: c[11], spec: c[12], pack: c[13], gall: c[14], manual: c[15], sBox: c[16], sInfo: c[17], ideal: c[18], tag: c[19] };
            galleryImgs = (p.gall && p.gall !== "/i") ? p.gall.split('|').map(i => i.trim()) : [];
            let html = `
                <div class="ultra-luxury-card">
                    <div class="premium-img-wrap"><img src="${p.hero}" onclick="openLB_Direct('${p.hero}')"></div>
                    <h1 class="luxury-title">${p.title}</h1>
                    <p style="text-align:center; color:#94a3b8;">${p.intro}</p>
                    <div style="text-align:center;"><a href="${p.ebay}" class="luxury-btn" target="_blank">Shop Now on eBay</a></div>
                    ${renderSection("Features", p.feat)}
                    ${renderSection("Specifications", p.spec)}
                    ${renderSection("Package Content", p.pack)}
                    <div id="gall-box"></div>
                    ${renderSection("User Manual", p.manual)}
                    ${p.sBox && p.sBox !== "/i" ? `<div class="safety-box">⚠️ ${p.sBox}</div>` : ''}
                    <div style="text-align:center; margin-top:30px; border-top:1px solid #1e293b; padding-top:20px;">
                        <div style="font-size:18px; font-weight:bold; color:white;">C & Grab</div>
                        <div style="font-size:12px; color:#64748b;">Powered by Pleiadians of Atlantis</div>
                    </div>
                </div>`;
            document.getElementById('master-luxury-root').innerHTML = html;
            if (galleryImgs.length > 0) {
                let gHTML = '<div class="section-header">Product Gallery</div><div class="premium-photo-grid">';
                galleryImgs.forEach(img => gHTML += `<div class="grid-item" onclick="openLB_Direct('${img}')"><img src="${img}"></div>`);
                document.getElementById('gall-box').innerHTML = gHTML + '</div>';
            }
        }
    } catch (e) { console.error(e); }
}
function renderSection(t, d) {
    if (!d || d === "/i") return "";
    return `<div class="section-header">${t}</div><ul class="luxury-list-ui">${d.split('|').map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
}
window.openLB_Direct = function(src) {
    document.getElementById('lb-img').src = src;
    document.getElementById('lb-overlay').style.display = 'flex';
}
