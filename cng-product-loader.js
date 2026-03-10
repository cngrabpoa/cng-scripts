/**
 * CNG OFFICIAL PRODUCT LOADER - FINAL ULTRA V4
 * Built to bypass all Blogger/Cache issues.
 */

(function() {
    // 1. CSS Injection (With !important to override Blogger styles)
    const css = `
        #master-luxury-root { all: initial; font-family: 'Segoe UI', Roboto, sans-serif; display: block; margin-bottom: 50px; }
        .ultra-luxury-card { background: linear-gradient(145deg, #131c2e, #020617) !important; color: #e2e8f0 !important; max-width: 800px !important; margin: 30px auto !important; padding: 40px !important; border-radius: 30px !important; border: 1px solid rgba(255, 255, 255, 0.05) !important; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6) !important; line-height: 1.8 !important; }
        .premium-img-wrap { text-align: center !important; margin-bottom: 30px !important; }
        .premium-img-wrap img { border-radius: 20px !important; width: 100% !important; max-width: 320px !important; border: 1px solid rgba(56, 189, 248, 0.3) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important; }
        .luxury-title { font-size: 28px !important; font-weight: 800 !important; text-align: center !important; color: #ffffff !important; margin-bottom: 20px !important; background: linear-gradient(to right, #fff, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .section-header { font-size: 20px !important; font-weight: 700 !important; color: #38bdf8 !important; margin-top: 35px !important; margin-bottom: 15px !important; border-bottom: 1px solid rgba(56, 189, 248, 0.2) !important; padding-bottom: 8px !important; }
        .luxury-list-ui { list-style: none !important; padding: 0 !important; margin: 15px 0 !important; }
        .luxury-list-ui li { position: relative !important; padding-left: 28px !important; margin-bottom: 10px !important; color: #94a3b8 !important; }
        .luxury-list-ui li::before { content: "✦" !important; position: absolute !important; left: 0 !important; color: #38bdf8 !important; }
        .safety-box { background: rgba(225, 29, 72, 0.1) !important; border: 1px solid rgba(225, 29, 72, 0.3) !important; padding: 15px !important; border-radius: 12px !important; margin: 20px 0 !important; color: #fb7185 !important; font-weight: 600 !important; text-align: center !important; }
        .luxury-btn { display: inline-block !important; padding: 15px 35px !important; background: #38bdf8 !important; color: #020617 !important; font-weight: 800 !important; text-transform: uppercase !important; text-decoration: none !important; border-radius: 50px !important; margin-top: 10px !important; }
        .premium-photo-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 10px !important; margin-top: 20px !important; }
        .grid-item img { width: 100% !important; height: 120px !important; object-fit: cover !important; border-radius: 10px !important; cursor: pointer !important; border: 1px solid rgba(56, 189, 248, 0.2) !important; }
        #lb-overlay { display: none; position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); align-items: center; justify-content: center; }
        @media (max-width: 600px) { .premium-photo-grid { grid-template-columns: repeat(2, 1fr) !important; } }
    `;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);

    // 2. Lightbox Structure
    const lb = document.createElement('div');
    lb.id = 'lb-overlay';
    lb.onclick = function() { this.style.display = 'none'; };
    lb.innerHTML = `<img id="lb-img" style="max-width:90%; max-height:80vh; border-radius:10px; border:2px solid #38bdf8;">`;
    document.body.appendChild(lb);

    // 3. Loader Function
    window.loadUltraProduct = async function(pid) {
        const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzdDxPhWEqI7Kwy6w8yb-BVipYp34HX-LPzTxMEwLjEh_cC5Z1X4tXOodZ0IxJRN9aZydBt2oKkA8r/pub?gid=647691696&single=true&output=csv";
        try {
            const res = await fetch(csvUrl);
            const text = await res.text();
            const rows = text.split(/\r?\n/);
            
            // Regex to handle CSV commas correctly
            const row = rows.find(r => {
                const cols = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                return cols[1] && cols[1].replace(/"/g, '').trim() === pid;
            });

            if (row) {
                const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
                
                // DATA MAPPING (B to T)
                const p = {
                    title: c[2], intro: c[3], hero: c[5], ebay: c[10],
                    feat: c[11], spec: c[12], pack: c[13], gall: c[14],
                    manual: c[15], sBox: c[16], sInfo: c[17], ideal: c[18], tag: c[19]
                };

                let postHTML = `
                <div class="ultra-luxury-card">
                    <div class="premium-img-wrap"><img src="${p.hero}"></div>
                    <h1 class="luxury-title">${p.title}</h1>
                    <p style="text-align: center; color: #94a3b8;">${p.intro}</p>
                    <div style="text-align: center;"><a href="${p.ebay}" class="luxury-btn" target="_blank">🛒 Shop Now on eBay</a></div>
                    
                    ${renderSection("Main Features", p.feat)}
                    ${renderSection("Product Specifications", p.spec)}
                    ${renderSection("What's in the Box", p.pack)}

                    <div id="gallery-target"></div>

                    ${renderSection("How to Use", p.manual)}
                    ${(p.sBox && p.sBox !== "/i") ? `<div class="safety-box">⚠️ ${p.sBox}</div>` : ''}
                    ${renderSection("Safety Information", p.sInfo)}
                    ${renderSection("Ideal For", p.ideal, "color:#4ade80 !important;")}

                    <p style="text-align:center; margin-top:40px; font-size:13px; color:#64748b; font-style:italic;">
                        ${p.tag ? p.tag.replace(/<\/?[^>]+(>|$)/g, "") : ""}
                    </p>
                    <div style="text-align:center; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); margin-top:30px;">
                        <strong style="color:white; font-size:16px;">C & Grab</strong><br>
                        <small style="color:#38bdf8;">Powered by Pleiadians of Atlantis</small>
                    </div>
                </div>`;

                document.getElementById('master-luxury-root').innerHTML = postHTML;

                // GALLERY RENDER
                if (p.gall && p.gall !== "/i") {
                    const imgs = p.gall.split('|').map(i => i.trim());
                    let gHTML = '<div class="section-header">Product Gallery</div><div class="premium-photo-grid">';
                    imgs.forEach(img => {
                        gHTML += `<div class="grid-item" onclick="document.getElementById('lb-img').src='${img}'; document.getElementById('lb-overlay').style.display='flex'"><img src="${img}"></div>`;
                    });
                    document.getElementById('gallery-target').innerHTML = gHTML + '</div>';
                }
            } else {
                document.getElementById('master-luxury-root').innerHTML = "<div style='color:red; text-align:center;'>Product Not Found!</div>";
            }
        } catch (e) { console.error("Loader Error:", e); }
    };

    function renderSection(title, data, style = "") {
        if (!data || data === "/i" || data.trim() === "") return "";
        const items = data.split('|').map(i => i.trim());
        return `<div class="section-header" style="${style}">${title}</div><ul class="luxury-list-ui">${items.map(li => `<li>${li}</li>`).join('')}</ul>`;
    }
})();
