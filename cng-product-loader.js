window.loadUltraProduct = async function(pid) {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzdDxPhWEqI7Kwy6w8yb-BVipYp34HX-LPzTxMEwLjEh_cC5Z1X4tXOodZ0IxJRN9aZydBt2oKkA8r/pub?gid=647691696&single=true&output=csv";
    
    // 1. CSS Injection
    const css = `#master-luxury-root{font-family:'Segoe UI',sans-serif;color:#e2e8f0}.ultra-luxury-card{background:linear-gradient(145deg,#131c2e,#020617);max-width:800px;margin:20px auto;padding:30px;border-radius:25px;border:1px solid rgba(255,255,255,0.05);box-shadow:0 20px 50px rgba(0,0,0,0.5)}.premium-img-wrap img{width:100%;max-width:300px;border-radius:15px;display:block;margin:0 auto 20px}.luxury-title{font-size:28px;font-weight:800;text-align:center;color:#fff;margin-bottom:15px}.luxury-btn{display:inline-block;padding:14px 35px;background:#38bdf8;color:#020617;font-weight:800;text-decoration:none;border-radius:50px;margin:20px 0}.section-header{font-size:18px;font-weight:700;color:#38bdf8;margin-top:25px;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:5px}.luxury-list-ui{list-style:none;padding:0}.luxury-list-ui li{margin:10px 0;padding-left:20px;position:relative;color:#94a3b8}.luxury-list-ui li::before{content:"✦";position:absolute;left:0;color:#38bdf8}.premium-photo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:20px}.grid-item img{width:100%;height:100px;object-fit:cover;border-radius:8px;cursor:pointer}`;
    if(!document.getElementById('cng-styles')){
        const s = document.createElement('style'); s.id='cng-styles'; s.innerHTML = css; document.head.appendChild(s);
    }

    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const rows = text.split(/\r?\n/);
        const row = rows.find(r => r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)[1]?.replace(/"/g, '').trim() === pid);

        if (row) {
            const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
            const p = { title: c[2], intro: c[3], hero: c[5], ebay: c[10], feat: c[11], spec: c[12], pack: c[13], gall: c[14] };
            
            // මේ හරියේ තමයි Variable නම 'finalHTML' කියලා හරියටම පාවිච්චි කරලා තියෙන්නේ
            let finalHTML = `
                <div class="ultra-luxury-card">
                    <div class="premium-img-wrap"><img src="${p.hero}"></div>
                    <h1 class="luxury-title">${p.title}</h1>
                    <p style="text-align:center;">${p.intro}</p>
                    <div style="text-align:center;"><a href="${p.ebay}" class="luxury-btn" target="_blank">Shop Now on eBay</a></div>
                    ${renderSection("Features", p.feat)}
                    ${renderSection("Specifications", p.spec)}
                    <div id="gallery-area"></div>
                    <div style="text-align:center;margin-top:30px;font-size:12px;opacity:0.5;">C & Grab | Powered by Pleiadians</div>
                </div>`;

            document.getElementById('master-luxury-root').innerHTML = finalHTML;

            if (p.gall && p.gall !== "/i") {
                const imgs = p.gall.split('|').map(i => i.trim());
                let gHTML = '<div class="section-header">Gallery</div><div class="premium-photo-grid">';
                imgs.forEach(img => { gHTML += `<div class="grid-item"><img src="${img}"></div>`; });
                document.getElementById('gallery-area').innerHTML = gHTML + '</div>';
            }
        }
    } catch (e) { console.error(e); }
};

function renderSection(t, d) {
    if (!d || d === "/i") return "";
    return `<div class="section-header">${t}</div><ul class="luxury-list-ui">${d.split('|').map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
}
