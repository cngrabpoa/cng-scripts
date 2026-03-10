/**
 * CNG OFFICIAL PRODUCT LOADER ENGINE
 * Author: Gemini AI Collaboration
 */

let galleryImgs = []; 
let currentIndex = 0;

async function loadUltraProduct(pid) {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzdDxPhWEqI7Kwy6w8yb-BVipYp34HX-LPzTxMEwLjEh_cC5Z1X4tXOodZ0IxJRN9aZydBt2oKkA8r/pub?gid=647691696&single=true&output=csv";
    
    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const rows = text.split(/\r?\n/);
        
        // Product ID එක අනුව පේළිය සොයාගැනීම
        const row = rows.find(r => {
            const cols = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return cols[1] && cols[1].replace(/"/g, '').trim() === pid;
        });

        if (row) {
            const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
            
            // Sheet Columns Mapping
            const p = { 
                title: c[2], intro: c[3], hero: c[5], ebay: c[10], 
                feat: c[11], spec: c[12], pack: c[13], gall: c[14], 
                manual: c[15], sBox: c[16], sInfo: c[17], ideal: c[18], tag: c[19] 
            };

            // Gallery Array එක සකස් කිරීම
            galleryImgs = (p.gall && p.gall !== "/i") ? p.gall.split('|').map(i => i.trim()) : [];

            // මුළු HTML සැකැස්ම (ඔබ එවූ Design එකමයි)
            let postHTML = `
            <div class="ultra-luxury-card">
                <div class="premium-img-wrap">
                    <a href="${p.ebay}" target="_blank"><img src="${p.hero}" alt="${p.title}"></a>
                </div>
                <h1 class="luxury-title">${p.title}</h1>
                <p style="text-align: center; color: #94a3b8;">${p.intro}</p>
                <div style="text-align: center;">
                    <a href="${p.ebay}" class="luxury-btn" target="_blank">Shop Now on eBay</a>
                </div>
                
                ${renderSection("Features:", p.feat)}
                ${renderSection("Specifications:", p.spec)}
                ${renderSection("Package Content:", p.pack)}
                
                <div id="gallery-area"></div>
                
                ${renderSection("User Manual & Guide:", p.manual)}
                ${(p.sBox && p.sBox !== "/i") ? `<div class="safety-box">⚠️ ${p.sBox}</div>` : ''}
                ${renderSection("Safety Information:", p.sInfo)}
                ${renderSection("Product Ideal For:", p.ideal, "color: #4ade80;")}
                
                <p style="text-align: center; margin-top: 40px; font-size: 14px; color: #64748b; font-style: italic; font-weight: normal !important;">
                    ${p.tag.replace(/<\/?[^>]+(>|$)/g, "")}
                </p>
            </div>`;
            
            document.getElementById('master-luxury-root').innerHTML = postHTML;

            // Gallery එක තිබේ නම් පමණක් පෙන්වීම
            if (galleryImgs.length > 0) {
                let gHTML = '<div class="section-header">Product Gallery:</div><div class="premium-photo-grid">';
                galleryImgs.forEach((img, index) => { 
                    gHTML += `<div class="grid-item" onclick="openLB(${index})"><img src="${img}"></div>`; 
                });
                document.getElementById('gallery-area').innerHTML = gHTML + '</div>';
            }
        }
    } catch (e) {
        console.error("CNG Loader Error: ", e);
    }
}

// ලැයිස්තු (Lists) සකසන Function එක
function renderSection(title, rawData, style = "") {
    if (!rawData || rawData === "/i" || rawData.trim() === "") return "";
    const items = rawData.split('|').map(i => i.trim());
    return `<div class="section-header" style="${style}">${title}</div><ul class="luxury-list-ui">${items.map(p => `<li>${p}</li>`).join('')}</ul>`;
}

// Lightbox පාලනය කරන Functions
function openLB(index) { 
    currentIndex = index; 
    updateLB(); 
    document.getElementById('lb-overlay').style.display = 'flex'; 
}

function updateLB() {
    document.getElementById('lb-img').src = galleryImgs[currentIndex];
    const tBox = document.getElementById('lb-thumbs-box');
    if (tBox) {
        tBox.innerHTML = galleryImgs.map((img, i) => 
            `<img src="${img}" class="lb-thumb ${i===currentIndex?'active':''}" onclick="currentIndex=${i};updateLB()">`
        ).join('');
    }
}

function closeLB() { 
    document.getElementById('lb-overlay').style.display = 'none'; 
}

function changeImg(s) { 
    currentIndex = (currentIndex + s + galleryImgs.length) % galleryImgs.length; 
    updateLB(); 
}