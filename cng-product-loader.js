/**
 * CNG OFFICIAL PRODUCT LOADER - ULTRA V5 (SAFE VERSION)
 */

(function(){

/* ---------------- CSS INJECTION ---------------- */

if(!document.getElementById("cng-style")){
const css = `
#master-luxury-root{
font-family:'Segoe UI',Roboto,sans-serif;
display:block;
margin-bottom:50px;
}

.ultra-luxury-card{
background:linear-gradient(145deg,#131c2e,#020617);
color:#e2e8f0;
max-width:800px;
margin:30px auto;
padding:40px;
border-radius:30px;
border:1px solid rgba(255,255,255,0.05);
box-shadow:0 30px 60px rgba(0,0,0,0.6);
line-height:1.8;
}

.premium-img-wrap{
text-align:center;
margin-bottom:30px;
}

.premium-img-wrap img{
border-radius:20px;
width:100%;
max-width:320px;
border:1px solid rgba(56,189,248,0.3);
box-shadow:0 10px 30px rgba(0,0,0,0.5);
}

.luxury-title{
font-size:28px;
font-weight:800;
text-align:center;
color:#fff;
margin-bottom:20px;
background:linear-gradient(to right,#fff,#38bdf8);
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.section-header{
font-size:20px;
font-weight:700;
color:#38bdf8;
margin-top:35px;
margin-bottom:15px;
border-bottom:1px solid rgba(56,189,248,0.2);
padding-bottom:8px;
}

.luxury-list-ui{
list-style:none;
padding:0;
margin:15px 0;
}

.luxury-list-ui li{
position:relative;
padding-left:28px;
margin-bottom:10px;
color:#94a3b8;
}

.luxury-list-ui li::before{
content:"✦";
position:absolute;
left:0;
color:#38bdf8;
}

.safety-box{
background:rgba(225,29,72,0.1);
border:1px solid rgba(225,29,72,0.3);
padding:15px;
border-radius:12px;
margin:20px 0;
color:#fb7185;
font-weight:600;
text-align:center;
}

.luxury-btn{
display:inline-block;
padding:15px 35px;
background:#38bdf8;
color:#020617;
font-weight:800;
text-transform:uppercase;
text-decoration:none;
border-radius:50px;
margin-top:10px;
}

.premium-photo-grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px;
margin-top:20px;
}

.grid-item img{
width:100%;
height:120px;
object-fit:cover;
border-radius:10px;
cursor:pointer;
border:1px solid rgba(56,189,248,0.2);
}

#lb-overlay{
display:none;
position:fixed;
z-index:99999;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.9);
align-items:center;
justify-content:center;
flex-direction:column;
}

#lb-overlay img{
max-width:90%;
max-height:80vh;
border-radius:10px;
border:2px solid #38bdf8;
}

#lb-close{
color:white;
font-size:28px;
margin-bottom:20px;
cursor:pointer;
}

@media(max-width:600px){
.premium-photo-grid{
grid-template-columns:repeat(2,1fr);
}
}
`;

const style = document.createElement("style");
style.id="cng-style";
style.innerHTML=css;
document.head.appendChild(style);
}

/* ---------------- LIGHTBOX ---------------- */

if(!document.getElementById("lb-overlay")){
const lb=document.createElement("div");
lb.id="lb-overlay";

lb.innerHTML=`
<div id="lb-close">✕ Close</div>
<img id="lb-img">
`;

lb.onclick=function(e){
if(e.target.id==="lb-overlay"||e.target.id==="lb-close"){
lb.style.display="none";
}
};

document.body.appendChild(lb);
}

/* ---------------- CSV CACHE ---------------- */

let cachedCSV=null;

async function getCSV(url){

if(cachedCSV) return cachedCSV;

const res=await fetch(url);
cachedCSV=await res.text();

return cachedCSV;

}

/* ---------------- HTML ESCAPE ---------------- */

function escapeHTML(str){

if(!str) return "";

return str.replace(/[&<>"']/g,function(m){

return ({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
"\"":"&quot;",
"'":"&#39;"
})[m];

});

}

/* ---------------- SECTION RENDER ---------------- */

function renderSection(title,data,style=""){

if(!data || data==="/i") return "";

const items=data.split("|").map(i=>i.trim());

return `
<div class="section-header" style="${style}">${escapeHTML(title)}</div>
<ul class="luxury-list-ui">
${items.map(li=>`<li>${escapeHTML(li)}</li>`).join("")}
</ul>
`;

}

/* ---------------- MAIN LOADER ---------------- */

window.loadUltraProduct=async function(pid){

const root=document.getElementById("master-luxury-root");

if(!root){
console.error("Root container missing");
return;
}

const csvUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vSzdDxPhWEqI7Kwy6w8yb-BVipYp34HX-LPzTxMEwLjEh_cC5Z1X4tXOodZ0IxJRN9aZydBt2oKkA8r/pub?gid=647691696&single=true&output=csv";

try{

const text=await getCSV(csvUrl);

const rows=text.split(/\r?\n/);

const row=rows.find(r=>{
const cols=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
return cols[1] && cols[1].replace(/"/g,"").trim()===pid;
});

if(!row){

root.innerHTML="<div style='color:red;text-align:center'>Product Not Found</div>";
return;

}

const c=row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v=>v.replace(/"/g,"").trim());

const p={
title:c[2],
intro:c[3],
hero:c[5],
ebay:c[10],
feat:c[11],
spec:c[12],
pack:c[13],
gall:c[14],
manual:c[15],
sBox:c[16],
sInfo:c[17],
ideal:c[18],
tag:c[19]
};

let html=`

<div class="ultra-luxury-card">

<div class="premium-img-wrap">
<img src="${p.hero}">
</div>

<h1 class="luxury-title">${escapeHTML(p.title)}</h1>

<p style="text-align:center;color:#94a3b8">
${escapeHTML(p.intro)}
</p>

<div style="text-align:center">
<a href="${p.ebay}" class="luxury-btn" target="_blank">
🛒 Shop Now on eBay
</a>
</div>

${renderSection("Main Features",p.feat)}
${renderSection("Product Specifications",p.spec)}
${renderSection("What's in the Box",p.pack)}

<div id="gallery-target"></div>

${renderSection("How to Use",p.manual)}

${p.sBox && p.sBox!="/i" ? `
<div class="safety-box">
⚠️ ${escapeHTML(p.sBox)}
</div>`:""}

${renderSection("Safety Information",p.sInfo)}

${renderSection("Ideal For",p.ideal,"color:#4ade80")}

<p style="text-align:center;margin-top:40px;font-size:13px;color:#64748b;font-style:italic">
${escapeHTML(p.tag)}
</p>

<div style="text-align:center;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);margin-top:30px">
<strong style="color:white;font-size:16px">C & Grab</strong><br>
<small style="color:#38bdf8">Powered by Pleiadians of Atlantis</small>
</div>

</div>
`;

root.innerHTML=html;

/* ---------- GALLERY ---------- */

if(p.gall && p.gall!=="/i"){

const imgs=p.gall.split("|").map(i=>i.trim());

const target=document.getElementById("gallery-target");

if(target){

let gHTML=`<div class="section-header">Product Gallery</div><div class="premium-photo-grid">`;

imgs.forEach(img=>{
gHTML+=`
<div class="grid-item">
<img src="${img}" onclick="document.getElementById('lb-img').src='${img}';document.getElementById('lb-overlay').style.display='flex'">
</div>
`;
});

target.innerHTML=gHTML+"</div>";

}

}

}catch(e){

console.error("Loader error:",e);

root.innerHTML="<div style='color:red;text-align:center'>Loading error</div>";

}

};

})();
