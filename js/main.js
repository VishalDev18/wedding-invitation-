/**
 * Royal Wedding Invitation Scripts - Groom's Edition
 * Ashish & Shivangi | Thursday, November 26, 2026
 * Features: 3D Imperial Gate, Cinematic Auto-Scroll, Countdown, Maps & WhatsApp RSVP
 */

let isAutoScrolling = false;
let autoScrollFrameId = null;

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initGateOpening();
  initAutoScrollControls();
  initCountdown();
  initCalendarButtons();
  initCopyAddress();
  initWhatsAppShare();
});

/* ==========================================================================
   1. Palace Gate Opening & Cinematic Auto-Scroll Trigger
   ========================================================================== */
function initGateOpening() {
  const gateOverlay = document.getElementById('gateOverlay');
  const btnOpenGate = document.getElementById('btnOpenGate');

  if (!gateOverlay || !btnOpenGate) return;

  btnOpenGate.addEventListener('click', () => {
    // 1. Play auspicious Shehnai / flute music
    if (window.playRoyalMusic) {
      window.playRoyalMusic();
    }

    // 2. Burst celebration rose & marigold petals
    if (window.burstPetals) {
      window.burstPetals(40);
    }

    // 3. Open 3D Palace Doors
    gateOverlay.classList.add('opened');

    // 4. Reveal body scroll
    document.body.classList.remove('gate-locked');
    window.dispatchEvent(new Event('resize'));

    // 5. Hide overlay & START CINEMATIC AUTO-SCROLL
    setTimeout(() => {
      gateOverlay.style.display = 'none';
      window.dispatchEvent(new Event('resize'));
      startAutoScroll();
    }, 1600);
  });
}

/* ==========================================================================
   2. Cinematic Automatic Smooth Scrolling
   ========================================================================== */
function startAutoScroll() {
  if (isAutoScrolling) return;
  isAutoScrolling = true;
  updateAutoScrollUI(true);

  const speed = 0.85;

  function autoScrollStep() {
    if (!isAutoScrolling) return;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
      stopAutoScroll();
      return;
    }

    window.scrollBy(0, speed);
    autoScrollFrameId = requestAnimationFrame(autoScrollStep);
  }

  autoScrollFrameId = requestAnimationFrame(autoScrollStep);
}

function stopAutoScroll() {
  if (!isAutoScrolling) return;
  isAutoScrolling = false;
  if (autoScrollFrameId) {
    cancelAnimationFrame(autoScrollFrameId);
    autoScrollFrameId = null;
  }
  updateAutoScrollUI(false);
}

window.toggleAutoScroll = function () {
  if (isAutoScrolling) {
    stopAutoScroll();
    showToast('Auto-scroll paused ⏸️');
  } else {
    startAutoScroll();
    showToast('Auto-scroll resumed ▶️');
  }
};

function updateAutoScrollUI(active) {
  const btn = document.getElementById('autoScrollToggleBtn');
  if (!btn) return;
  if (active) {
    btn.classList.add('active');
    btn.title = 'Pause Auto-Scroll';
  } else {
    btn.classList.remove('active');
    btn.title = 'Resume Auto-Scroll';
  }
}

function initAutoScrollControls() {
  const pauseEvents = ['wheel', 'touchstart', 'mousedown'];
  pauseEvents.forEach((evt) => {
    window.addEventListener(evt, () => {
      if (isAutoScrolling) {
        stopAutoScroll();
      }
    }, { passive: true });
  });

  const toggleBtn = document.getElementById('autoScrollToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.toggleAutoScroll();
    });
  }
}

/* ==========================================================================
   3. Live Wedding Countdown
   ========================================================================== */
function initCountdown() {
  // Wedding Date: Thursday, November 26, 2026 at 19:00 (7:00 PM) IST (+05:30)
  const targetDate = new Date('2026-11-26T19:00:00+05:30').getTime();

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      const label = document.getElementById('cdCelebrationLabel');
      if (label) label.textContent = '✨ The Royal Vivah is Happening Today! ✨';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   4. Add to Calendar (Google Calendar & iCal .ics)
   ========================================================================== */
function initCalendarButtons() {
  const events = {
    all: {
      title: "Wedding of Ashish & Shivangi",
      start: "20261126T190000",
      end: "20261127T020000",
      details: "Auspicious wedding ceremony of Ashish with Shivangi. Baraat Swagat, Varmala, and sacred Pheras at Umang Lawn, Lucknow.",
      location: "Umang Lawn, Deva Road, Matiyari, Lucknow, Uttar Pradesh",
    },
    tilak: {
      title: "Tilak & Sagai - Ashish & Shivangi",
      start: "20261125T180000",
      end: "20261125T220000",
      details: "Traditional Tilak and engagement ceremony for Groom Ashish.",
      location: "Groom's Residence, Lucknow",
    },
    haldi: {
      title: "Haldi & Tel Pujan - Ashish & Shivangi",
      start: "20261126T100000",
      end: "20261126T130000",
      details: "Turmeric blessings and sacred rituals for groom Ashish.",
      location: "Groom's Residence, Lucknow",
    },
    baraat: {
      title: "Baraat Prasthan - Ashish Weds Shivangi",
      start: "20261126T180000",
      end: "20261126T190000",
      details: "Royal Baraat departure with Dhol and celebration.",
      location: "Groom's Residence to Umang Lawn, Lucknow",
    },
    wedding: {
      title: "Shubh Vivah (Wedding) - Ashish & Shivangi",
      start: "20261126T190000",
      end: "20261127T020000",
      details: "Baraat Swagat (7:00 PM), Varmala (8:30 PM), Royal Feast & Sacred Pheras for Ashish & Shivangi.",
      location: "Umang Lawn, Deva Road, Matiyari, Lucknow, Uttar Pradesh",
    },
  };

  document.querySelectorAll('[data-calendar-event]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventKey = btn.getAttribute('data-calendar-event');
      const evt = events[eventKey] || events.all;

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        evt.title
      )}&dates=${evt.start}/${evt.end}&details=${encodeURIComponent(
        evt.details
      )}&location=${encodeURIComponent(evt.location)}`;

      window.open(gcalUrl, '_blank');
    });
  });

  const icsBtn = document.getElementById('downloadIcsBtn');
  if (icsBtn) {
    icsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadIcs(events.all);
    });
  }
}

function downloadIcs(evt) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ashish & Shivangi Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${evt.title}`,
    `DESCRIPTION:${evt.details}`,
    `LOCATION:${evt.location}`,
    `DTSTART:${evt.start}`,
    `DTEND:${evt.end}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'Ashish-Shivangi-Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==========================================================================
   5. Copy Address to Clipboard
   ========================================================================== */
function initCopyAddress() {
  document.querySelectorAll('.btn-copy-address').forEach((btn) => {
    btn.addEventListener('click', () => {
      const addressText = btn.getAttribute('data-address');
      if (!addressText) return;

      navigator.clipboard.writeText(addressText).then(() => {
        showToast('Venue address copied! 📋');
      }).catch(() => {
        showToast('Address copied! 📋');
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('weddingToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'weddingToast';
    toast.className = 'wedding-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ==========================================================================
   6. WhatsApp Share
   ========================================================================== */
function initWhatsAppShare() {
  const shareButtons = document.querySelectorAll('.btn-share-whatsapp');

  shareButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUrl = window.location.href;
      const shareText = `🌸 *Wedding Invitation: Ashish & Shivangi* 🌸\n\nWith the divine blessings of Shri Ganesh Ji, we cordially invite you and your family to grace the auspicious wedding of our beloved son *Ashish* with *Shivangi*.\n\n📅 *Date:* Thursday, November 26, 2026 • 7:00 PM\n📍 *Venue:* Umang Lawn, Deva Road, Matiyari, Lucknow\n\n✨ Open the royal digital invitation here:\n${currentUrl}`;

      const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(shareUrl, '_blank');
    });
  });
}

/* ==========================================================================
   7. Royal Theme Palette Switcher
   ========================================================================== */
function initThemeSwitcher() {
  const switcher = document.getElementById('themeSwitcherWidget');
  const triggerBtn = document.getElementById('themeTriggerBtn');
  const optBtns = document.querySelectorAll('.theme-opt-btn');

  // Load saved theme or default to 'emerald' (Royal Mewar Emerald & Kundan Gold)
  const savedTheme = localStorage.getItem('royal_wedding_theme') || 'emerald';
  applyTheme(savedTheme);

  if (!switcher || !triggerBtn) return;

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) {
      switcher.classList.remove('open');
    }
  });

  optBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-set-theme');
      applyTheme(theme);
      localStorage.setItem('royal_wedding_theme', theme);
      switcher.classList.remove('open');

      if (window.burstPetals) {
        window.burstPetals(25);
      }
      showToast(`✨ Palace Theme Updated: ${btn.textContent.trim()} ✨`);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    optBtns.forEach((b) => {
      if (b.getAttribute('data-set-theme') === theme) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }
}

