/**
 * PRIDE AND PREJUDICE — PREMIUM DIGITAL EBOOK STOREFRONT
 * JavaScript Controller & Payment Integration
 * 
 * Configurable Variables for Production Deployment:
 */

// 1. CASHFREE PAYMENT CONFIGURATION
// Live Cashfree Payment Link configured:
const CASHFREE_PAYMENT_URL = "https://payments.cashfree.com/links?code=harrvv1va3ng_AAAAAAASvY";

// 2. SUCCESS REDIRECT URL (Must also be configured on Cashfree Dashboard as return_url)
const THANK_YOU_URL = "thank-you.html";

// 3. EBOOK DIGITAL ACCESS / DOWNLOAD URL
const DOWNLOAD_URL = "assets/Pride_and_Prejudice_Digital_Edition.pdf";

document.addEventListener("DOMContentLoaded", () => {
  initPaymentButtons();
  initHeaderScroll();
  initPreviewGallery();
  initPreviewModal();
  initFaqAccordion();
  initScrollReveal();
  init3DCoverTilt();
  initThankYouPage();
});

/**
 * Handles Payment CTA clicks and redirects to Cashfree
 */
function initPaymentButtons() {
  const ctaButtons = document.querySelectorAll(".btn-checkout");

  ctaButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Show Loading State
      btn.classList.add("loading");
      const textSpan = btn.querySelector(".btn-text");
      const originalText = textSpan ? textSpan.textContent : btn.textContent;
      
      if (textSpan) {
        textSpan.textContent = "Redirecting to secure payment…";
      }

      // Smooth redirect to Cashfree
      setTimeout(() => {
        if (!CASHFREE_PAYMENT_URL || CASHFREE_PAYMENT_URL === "YOUR_CASHFREE_PAYMENT_URL") {
          console.warn(
            "[Cashfree Configuration Notice] You are using the default placeholder for CASHFREE_PAYMENT_URL. " +
            "Please update CASHFREE_PAYMENT_URL in script.js with your live Cashfree Payment Link."
          );

          const proceed = confirm(
            "Cashfree Payment Link Setup:\n\n" +
            "In production, this button redirects directly to your Cashfree checkout page.\n\n" +
            "Click OK to test the post-payment 'Thank You' delivery page now."
          );

          if (proceed) {
            window.location.href = `${THANK_YOU_URL}?order_id=DEMO_${Date.now()}&status=SUCCESS`;
          } else {
            btn.classList.remove("loading");
            if (textSpan) textSpan.textContent = originalText;
          }
        } else {
          // Live Cashfree Redirect
          window.location.href = CASHFREE_PAYMENT_URL;
        }
      }, 500);
    });
  });
}

/**
 * Sticky Header Scroll State
 */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/**
 * Interactive 3D Tilt for Hero Book Cover (Desktop)
 */
function init3DCoverTilt() {
  const card = document.querySelector(".book-card-3d");
  const wrapper = document.querySelector(".hero-cover-wrapper");
  if (!card || !wrapper) return;

  // Only enable on non-touch devices with fine pointers
  if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotY = (x / (rect.width / 2)) * 10;
      const rotX = -(y / (rect.height / 2)) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    wrapper.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }
}

/**
 * Preview Gallery Scroll Buttons & Drag
 */
function initPreviewGallery() {
  const gallery = document.querySelector(".preview-gallery");
  const prevBtn = document.querySelector(".preview-btn-prev");
  const nextBtn = document.querySelector(".preview-btn-next");

  if (!gallery) return;

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      gallery.scrollBy({ left: -320, behavior: "smooth" });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      gallery.scrollBy({ left: 320, behavior: "smooth" });
    });
  }
}

/**
 * High-Res Preview Lightbox Modal
 */
function initPreviewModal() {
  const modal = document.getElementById("previewModal");
  const modalImg = document.getElementById("previewModalImg");
  const modalTitle = document.getElementById("previewModalTitle");
  const closeBtn = document.getElementById("previewModalClose");
  const items = document.querySelectorAll(".preview-item");

  if (!modal || !modalImg) return;

  items.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const title = item.querySelector(".preview-caption-title");
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || "Book Page Preview";
      }
      if (modalTitle && title) {
        modalTitle.textContent = title.textContent;
      }
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

/**
 * FAQ Accordion Toggles (Robust Class-Based CSS Grid Animation)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const trigger = item.querySelector(".faq-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const isCurrentlyActive = item.classList.contains("active");

      // Close all other items for a clean single-open experience
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          const otherTrigger = otherItem.querySelector(".faq-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle clicked item
      if (isCurrentlyActive) {
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/**
 * Scroll Reveal Animations via Intersection Observer
 */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal-fade-up");
  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach(el => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px"
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * Thank You Page Access Handling
 */
function initThankYouPage() {
  const downloadBtn = document.getElementById("btnDownloadEbook");
  if (!downloadBtn) return;

  downloadBtn.addEventListener("click", (e) => {
    // Allows direct native download of PDF
    console.log("Downloading eBook PDF:", DOWNLOAD_URL);
  });
}
