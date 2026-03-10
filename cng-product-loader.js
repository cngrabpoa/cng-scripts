window.loadUltraProduct = async function(pid) {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzdDxPhWEqI7Kwy6w8yb-BVipYp34HX-LPzTxMEwLjEh_cC5Z1X4tXOodZ0IxJRN9aZydBt2oKkA8r/pub?gid=647691696&single=true&output=csv";

    if (!document.getElementById('cng-ultra-styles')) {
        const css = `
            #master-luxury-root { font-family: 'Segoe UI', sans-serif; color: #e2e8f0; }
            .ultra-luxury-card { background: linear-gradient(145deg, #131c2e, #020617); max-width: 800px; margin: 20px auto; padding: 35px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
            .premium-img-wrap { text-align: center; margin-bottom: 25px; }
            .premium-img-wrap img { width: 100%; max-width: 320px; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.3); }
            .luxury-title { font-size: 30px; font-weight: 800; text-align: center; color: #fff; margin-bottom: 10px; }
            .price-tag { text-align: center; font-size: 24px; color: #4ade80; font-weight: bold; margin-bottom: 20px; }
            .section-header { font-size: 19px; font-weight: 700; color: #38bdf8; margin-top: 30px; border-bottom: 1px solid rgba(56,189,248,0.2); padding-bottom: 5px; }
            .luxury-list-ui { list-style: none; padding: 0; margin: 15px 0; }
            .luxury-list-ui li { position: relative; padding-left: 25px; margin-bottom: 10px; color: #94a3b8; }
            .luxury-list-ui li::before { content: "✦"; position: absolute; left: 0; color: #38bdf8; }
            .safety-box { background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); padding: 15px; border-radius: 12px; margin: 20px 0; color: #fb7185; font-weight: 600; text-align: center; }
            .luxury-btn { display: inline-block; padding: 15px 35px; background: #38bdf8; color: #020617; font-weight: 800; text-decoration: none; border-radius: 50px; margin: 20px 0; }
            .photo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px; }
            .photo-grid img { width: 100%; height: 100px; object-fit: cover; border-radius: 10px; cursor: pointer; border: 1px solid rgba(56, 189, 248, 0.2); }
            #lb-overlay { display: none; position: fixed; z-index: 10000; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); align-items: center; justify-content: center; }
            @media (max-width: 600px) { .photo-grid { grid-template-columns: repeat(2, 1fr); } }
        `;
        const s = document.createElement('style'); s.id = 'cng-ultra-styles'; s.innerHTML = css; document.head.appendChild(s);
    }

    if (!document.getElementById('lb-overlay')) {
        const lb = document.createElement('div');
        lb.id = 'lb-overlay'; lb.onclick = function() { this.style.display = 'none'; };
        lb.innerHTML = `<img id="lb-img" style="max-width:90%; max-height:80vh; border:2px solid #38bdf8; border-radius:10px;">`;
        document.body.appendChild(lb);
    }

    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const rows = text.split(/\r?\n/);

        // Find product row (Column B = Index 1)
        const row = rows.find(r => {
            const cols = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return cols[1] && cols[1].replace(/"/g, '').trim() === pid;
        });

        if (row) {
            const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
            
            // EXACT MAPPING BASED ON YOUR A-T LIST
            const p = {
                id: c[1], title: c[2], intro: c[3], postLink: c[4], hero: c[5],
                price: c[6], curr: c[7], stock: c[8], cond: c[9], ebay: c[10],
                feat: c[11], spec: c[12], pack: c[13], gall: c[14], manual: c[15],
                sBox: c[16], sInfo: c[17], ideal: c[18], tag: c[19]
            };

            const finalHTML = `
                <div class="ultra-luxury-card">
                    <div class="premium-img-wrap"><img src="${p.hero}"></div>
                    <h1 class="luxury-title">${p.title}</h1>
                    <div class="price-tag">${p.curr} ${p.price}</div>
                    <p style="text-align:center; color:#94a3b8;">${p.intro}</p>
                    <div style="text-align:center;"><a href="${p.ebay}" class="luxury-btn" target="_blank">🛒 SHOP ON EBAY</a></div>
                    
                    ${renderUI("Main Features", p.feat)}
                    ${renderUI("Specifications", p.spec)}
                    ${renderUI("Package Content", p.pack)}

                    <div id="gallery-target"></div>

                    ${renderUI("User Guide / Manual", p.manual)}
                    ${(p.sBox && p.sBox !== "/i") ? `<div class="safety-box">⚠️ ${p.sBox}</div>` : ''}
                    ${renderUI("Safety Information", p.sInfo)}
                    ${renderUI("Ideal For", p.ideal, "color:#4ade80;")}

                    <div style="text-align:center; margin-top:40px; border-top:1px solid #1e293b; padding-top:20px;">
                        <div style="font-size:11px; color:#64748b; margin-bottom:10px;">${p.tag}</div>
                        <strong style="color:white;">C & Grab</strong><br>
                        <small style="color:#38bdf8;">Powered by Pleiadians of Atlantis</small>
                    </div>
                </div>`;

            document.getElementById('master-luxury-root').innerHTML = finalHTML;

            if (p.gall && p.gall !== "/i") {
                const imgs = p.gall.split('|').map(i => i.trim());
                let gHTML = '<div class="section-header">Product Gallery</div><div class="photo-grid">';
                imgs.forEach(img => {
                    gHTML += `<img src="${img}" onclick="event.stopPropagation(); document.getElementById('lb-img').src='${img}'; document.getElementById('lb-overlay').style.display='flex';">`;
                });
                document.getElementById('gallery-target').innerHTML = gHTML + '</div>';
            }
        }
    } catch (e) { console.error("CNG ERROR:", e); }
};

function renderUI(title, data, style = "") {
    if (!data || data === "/i" || data.trim() === "") return "";
    const items = data.split('|').map(i => i.trim());
    return `<div class="section-header" style="${style}">${title}</div><ul class="luxury-list-ui">${items.map(li => `<li>${li}</li>`).join('')}</ul>`;
}
