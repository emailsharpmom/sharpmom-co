document.addEventListener('DOMContentLoaded', () => {
    // Safety check for config
    if (typeof CONFIG === 'undefined' || CONFIG.GOOGLE_SCRIPT_URL.includes("YOUR_ACTUAL")) {
        console.warn("⚠️ Database not connected. Check config.js");
    }
    loadContent();
    setupListeners();
});

// --- 1. RENDER CONTENT ---
function loadContent() {
    const serviceGrid = document.querySelector('.services-grid');
    if(serviceGrid) serviceGrid.innerHTML = appData.services.map(s => 
        `<div class="service-item"><i class="ph ${s.icon}"></i><p>${s.text}</p></div>`
    ).join('');

    const pricingGrid = document.querySelector('.pricing-grid');
    if(pricingGrid) pricingGrid.innerHTML = appData.pricing.map(item => 
        `<div class="price-item">
            <i class="ph ${item.icon}" style="${item.scale ? `transform: scale(${item.scale})` : ''}"></i>
            <span class="price-label">${item.label} ${item.price}</span>
        </div>`
    ).join('');

    const scheduleGrid = document.querySelector('.schedule-grid');
    if(scheduleGrid) scheduleGrid.innerHTML = appData.markets.map(market => 
        `<div class="market-card" onclick="openModal('${market.name}')">
            <div class="market-date">${market.time}</div>
            <h3>${market.name}</h3>
            <p>${market.location}</p>
            <div class="card-cta">Get a reminder →</div>
        </div>`
    ).join('');

    const resultsContainer = document.querySelector('.results-carousel');
    if (resultsContainer) {
        if (!appData.results || appData.results.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center; width:100%;">Add images to data.js</p>';
        } else {
            resultsContainer.innerHTML = appData.results.map(img => `
                <div class="result-card">
                    <div class="result-img-wrapper">
                        <img src="${img.src}" alt="${img.caption}" class="result-img">
                    </div>
                    <div class="result-caption">${img.caption}</div>
                </div>
            `).join('');
            startAutoScroll('.results-carousel');
        }
    }

    const reviewsTrack = document.querySelector('.reviews-track');
    if (reviewsTrack) {
        reviewsTrack.innerHTML = appData.reviews.map(r => `
            <div class="review-card">
                <div class="stars">★★★★★</div>
                <p class="review-text">"${r.text}"</p>
                <div class="review-meta">
                    <strong>${r.name}</strong> • ${r.source}
                </div>
            </div>
        `).join('');
    }
    
    if(appData.socials) {
        const gl = document.getElementById('link-google');
        const nl = document.getElementById('link-nextdoor');
        const il = document.getElementById('link-instagram');
        
        if(gl) gl.href = appData.socials.google || "#";
        if(nl) nl.href = appData.socials.nextdoor || "#";
        if(il) il.href = appData.socials.instagram || "#";
    }
}

// --- 2. HELPER: AUTO SCROLL ---
function startAutoScroll(selector) {
    const track = document.querySelector(selector);
    if (!track) return;
    let direction = 1;
    let isPaused = false;
    track.addEventListener('mouseenter', () => isPaused = true);
    track.addEventListener('mouseleave', () => isPaused = false);
    setInterval(() => {
        if (!isPaused) {
            track.scrollLeft += direction; 
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
                 track.scrollLeft = 0; 
            }
        }
    }, 30);
}

// --- 3. DATABASE CONNECTION ---
async function saveLeadToDB(phone, market) {
    console.log("🚀 Attempting to save to DB...", { phone, market });

    if (typeof CONFIG === 'undefined') {
        console.error("❌ Config is missing!");
        return;
    }

    // We send specific JSON structure
    const payload = { 
        type: "lead", // Although our simplified backend doesn't check type, good to keep structure
        phone: phone, 
        market: market 
    };

    try {
        // We use 'no-cors' mode which is required for Google Apps Script Web Apps
        // This means we won't get a readable JSON response back, but the request WILL go through.
        await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: { 
                "Content-Type": "text/plain;charset=utf-8" 
            },
            body: JSON.stringify(payload)
        });
        
        console.log("✅ Request sent successfully.");
        return true;
    } catch (err) {
        console.error("❌ Database Error:", err);
        alert("Could not save reminder. Please check your internet connection.");
        return false;
    }
}

// --- 4. MODAL CONTROLLER ---
let activeMarket = "";
window.openModal = function(marketName) {
    activeMarket = marketName;
    const modal = document.getElementById('marketModal');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
        <span class="close-modal" onclick="closeModal(event)">×</span>
        <h3>${marketName} Reminder</h3>
        <p class="modal-sub">Enter your number to get a text reminder 1 hour before this market closes.</p>
        <input type="tel" id="userPhone" class="modal-input" placeholder="(408) 555-0123">
        <button id="saveBtn" class="btn btn-primary full-width">Remind Me</button>
    `;
    
    document.getElementById('saveBtn').onclick = handleSave;
    modal.style.display = "flex";
}

async function handleSave() {
    const phoneVal = document.getElementById('userPhone').value;
    const btn = document.getElementById('saveBtn');

    if(!phoneVal) { alert("Please enter a phone number"); return; }

    btn.innerText = "Saving...";
    btn.disabled = true;
    
    // Attempt save
    await saveLeadToDB(phoneVal, activeMarket);

    // Show Success UI (We assume success because of no-cors mode)
    document.getElementById('modalContent').innerHTML = `
        <span class="close-modal" onclick="closeModal(event)">×</span>
        <div style="padding: 20px 0;">
            <i class="ph ph-check-circle" style="font-size: 3rem; color: var(--color-teal);"></i>
            <h3>All set!</h3>
            <p style="margin-top: 15px;">Thank you! We will remind you to get your knives at the farmers market.</p>
        </div>
    `;
}

window.closeModal = function(e) {
    const modal = document.getElementById('marketModal');
    if (!e || e.target === modal || e.target.classList.contains('close-modal')) {
        modal.style.display = "none";
    }
}

// --- 5. SMS LINK HANDLER (UPDATED FOR MAC) ---
function setupListeners() {
    const doorBtn = document.getElementById('doorstep-link');
    if(doorBtn) {
        doorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Clean Phone Number: Remove dashes, spaces, brackets.
            const rawPhone = appData.business.phone.replace(/[^0-9]/g, ''); 
            
            const msg = encodeURIComponent(appData.messages.doorstepBooking);
            const ua = navigator.userAgent.toLowerCase();
            let url = "";

            // FIX: Added 'macintosh' to the check. Mac Desktop apps behave like iOS.
            if (/iphone|ipad|ipod|macintosh/.test(ua)) {
                // iOS / Mac Syntax (Uses '&')
                url = `sms:${rawPhone}&body=${msg}`;
            } else {
                // Android / Windows Syntax (Uses '?')
                url = `sms:${rawPhone}?body=${msg}`;
            }

            console.log("Launching SMS to:", url);
            window.location.href = url;
        });
    }
}