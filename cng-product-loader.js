/**
 * CNG OFFICIAL PRODUCT LOADER ENGINE
 * Author: Gemini AI Collaboration
 * 100% Mirror of Requested HTML/JS Structure
 */

let galleryImgs = [];
let currentIndex = 0;

// Inject CSS into the Page Head
(function injectStyles() {
    const css = `
        .ultra-luxury-card { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; max-width: 800px; margin: 30px auto; padding: 45px; background: linear-gradient(145deg, #131c2e, #020617); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6); line-height: 1.8; }
        .premium-img-wrap { text-align: center; margin-bottom: 40px; }
        .premium-img-wrap img { border-radius: 20px; width: 100%; height: auto; max-width: 320px; border: 1px solid rgba(56, 189, 248, 0.2); transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4); cursor: pointer; }
        .premium-img-wrap img:hover { transform: translateY(-12px) scale(1.03); box-shadow: 0 25px 50px rgba(56, 189, 248, 0.25); border: 1px solid rgba(56, 189, 248, 0.5); }
        .luxury-title { font-size: 32px; font-weight: 800; text-align: center; background: linear-gradient(to right, #ffffff, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 25px; display: block !important; }
        .section-header { font-size: 20px; font-weight: 700; color: #38bdf8; margin-top: 35px; margin-bottom: 15px; display: flex; align-items: center; border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding-bottom: 8px; }
        .luxury-list-ui { list-style: none !important; padding: 0 !important; margin: 15px 0 !important; }
        .luxury-list-ui li { position: relative; padding-left: 28px !important; margin-bottom: 12px; color: #94a3b8; }
        .luxury-list-ui li::before { content: "✦"; position: absolute; left: 0; color: #38bdf8; font-weight: bold; }
        .safety-box { background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); padding: 15px; border-radius: 12px; margin: 20px 0; color: #fb7185; font-weight: 600; text-align: center; }
        .luxury-btn { display: inline-block; padding: 16px 40px; background: #38bdf8; color: #020617 !important; font-weight: 800; text-transform: uppercase; text-decoration: none !important; border-radius: 50px; transition: 0.3s; margin: 20px 0; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.3); }
        .luxury-btn:hover { transform: translateY(-4px); background: #7dd3fc; }
        .premium-photo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 30px 0; }
        .grid-item { overflow: hidden; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.2); transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); cursor: pointer; }
        .grid-item img { width: 100%; height: 160px; object-fit: cover; display: block; transition: all 0.5s ease; }
        .grid-item:hover { transform: translateY(-8px); border-color: #38bdf8; box-shadow: 0 15px 30px rgba(56, 189, 248, 0.3); }
        .grid-item:hover img { transform: scale(1.1); }
        #lb-overlay { display: none; position: fixed; z-index: 10000; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px); flex-direction: column; align-items: center; justify-content: center; }
        #lb-container { position: relative; max-width: 90%; display: flex; flex-direction: column; align-items: center; }
        #lb-img { max-width: 100%; max-height: 70vh; border-radius: 10px; border: 2px solid rgba(56, 189, 248, 0.3); margin-bottom: 20px; }
        #lb-thumbs-box { display: flex; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow-x: auto; }
        .lb-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 5px; cursor: pointer; border: 2px solid transparent; opacity: 0.6; }
        .lb-thumb.active { border-color: #38bdf8; opacity: 1; }
        .lb-close { position: absolute; top: -50px; right: 0; color: white; font-size: 40px; cursor: pointer; }
        .lb-btn { position: absolute; top: 40%; transform: translateY(-50%); background: rgba(56, 189, 248, 0.2); color: white; border: none; padding: 15px; cursor: pointer; font-size: 24px; border-radius: 50%; }
        .lb-prev { left: -70px; } .lb-next { right: -70px; }
        @media (max-width: 600px) { .premium-photo-grid { grid-template-columns: repeat(2, 1fr); } .lb-btn { display: none; } }
    `;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);

    const overlay = `
        <div id="lb-overlay" onclick="closeLB()">
            <div id="lb-container" onclick="event.stopPropagation()">
                <span class="lb-close" onclick="closeLB()">&times;</span>
                <button class="lb-btn lb-prev" onclick="changeImg(-1)">&#10094;</button>
                <img id="lb-img" src="">
                <button class="lb-btn lb-next" onclick="changeImg(1)">&#10095;</button>
                <div id="lb-thumbs-box"></div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', overlay);
})();

async function loadUltraProduct(pid) {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzdDxPhWEqI7Kwy6w8yb-BVipYp34HX-LPzTxMEwLjEh_cC5Z1X4tXOodZ0IxJRN9aZydBt2oKkA8r/pub?gid=647691696&single=true&output=csv";
    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const rows = text.split(/\r?\n/);
        
        const row = rows.find(r => {
            const cols = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return cols[1]?.replace(/"/g, '').trim() === pid;
        });

        if (row) {
            const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
            const p = { 
                title: c[2], intro: c[3], hero: c[5], ebay: c[10], 
                feat: c[11], spec: c[12], pack: c[13], gall: c[14], 
                manual: c[15], sBox: c[16], sInfo: c[17], ideal: c[18], tag: c[19] 
            };

            galleryImgs = (p.gall && p.gall !== "/i") ? p.gall.split('|').map(i => i.trim()) : [];

            let postHTML = `
            <div class="ultra-luxury-card">
                <div class="premium-img-wrap"><a href="${p.ebay}" target="_blank"><img src="${p.hero}"></a></div>
                <h1 class="luxury-title">${p.title}</h1>
                <p style="text-align: center; color: #94a3b8;">${p.intro}</p>
                <div style="text-align: center;"><a href="${p.ebay}" class="luxury-btn" target="_blank">Shop Now on eBay</a></div>
                ${renderSection("Features:", p.feat)}
                ${renderSection("Specifications:", p.spec)}
                ${renderSection("Package Content:", p.pack)}
                <div id="gallery-area"></div>
                ${renderSection("User Manual & Guide:", p.manual)}
                ${p.sBox && p.sBox !== "/i" ? `<div class="safety-box">⚠️ ${p.sBox}</div>` : ''}
                ${renderSection("Safety Information:", p.sInfo)}
                ${renderSection("Product Ideal For:", p.ideal, "color: #4ade80;")}
                <p style="text-align: center; margin-top: 40px; font-size: 14px; color: #64748b; font-style: italic;">
                    ${p.tag.replace(/<\/?[^>]+(>|$)/g, "")}
                </p>
                <div style="text-align:center; padding:25px 15px; margin-top:30px; border-top:1px solid rgba(255,255,255,0.08);">
                    <div style="font-size:18px; font-weight:bold; color:#ffffff;">C & Grab</div>
                    <div style="font-size:13px; color:#a5b4fc;">Powered by <b>Pleiadians of Atlantis</b></div>
                </div>
            </div>`;
            
            document.getElementById('master-luxury-root').innerHTML = postHTML;

            if (galleryImgs.length > 0) {
                let gHTML = '<div class="section-header">Product Gallery:</div><div class="premium-photo-grid">';
                galleryImgs.forEach((img, index) => { gHTML += `<div class="grid-item" onclick="openLB(${index})"><img src="${img}"></div>`; });
                document.getElementById('gallery-area').innerHTML = gHTML + '</div>';
            }
        }
    } catch (e) { console.error(e); }
}

function renderSection(title, rawData, style = "") {
    if (!rawData || rawData === "/i" || rawData.trim() === "") return "";
    const items = rawData.split('|').map(i => i.trim());
    return `<div class="section-header" style="${style}">${title}</div><ul class="luxury-list-ui">${items.map(p => `<li>${p}</li>`).join('')}</ul>`;
}

window.openLB = function(index) { currentIndex = index; updateLB(); document.getElementById('lb-overlay').style.display = 'flex'; }
window.updateLB = function() {
    document.getElementById('lb-img').src = galleryImgs[currentIndex];
    const tBox = document.getElementById('lb-thumbs-box');
    tBox.innerHTML = galleryImgs.map((img, i) => `<img src="${img}" class="lb-thumb ${i===currentIndex?'active':''}" onclick="currentIndex=${i};updateLB()">`).join('');
}
window.closeLB = function() { document.getElementById('lb-overlay').style.display = 'none'; }
window.changeImg = function(s) { currentIndex = (currentIndex + s + galleryImgs.length) % galleryImgs.length; updateLB(); }
