// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Custom Cursor Interaction
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag (using simple JS animation)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects on links expand cursor
    const links = document.querySelectorAll("a, .btn-primary, .info-item");
    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            cursorOutline.style.width = "60px";
            cursorOutline.style.height = "60px";
            cursorOutline.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        });
        link.addEventListener("mouseleave", () => {
            cursorOutline.style.width = "40px";
            cursorOutline.style.height = "40px";
            cursorOutline.style.backgroundColor = "transparent";
        });
    });

    // Hero Animation (On Load)
    const tl = gsap.timeline();
    tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2
    })
        .from(".hero-subtitle", {
            y: 50,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        }, "-=1")
        .from(".scroll-indicator", {
            opacity: 0,
            duration: 2,
            ease: "power2.inOut"
        }, "-=1");

    // Parallax Effect for Hero Background
    gsap.to(".hero-bg", {
        yPercent: 30, // Moves down as we scroll down
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Scroll Reveal Animations
    // Text Reveals
    gsap.utils.toArray(".reveal-text").forEach(element => {
        gsap.to(element, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%", // Start when top of element is at 85% of viewport height
                toggleActions: "play none none reverse"
            }
        });
    });

    // Image Reveals
    gsap.utils.toArray(".reveal-image").forEach(element => {
        gsap.to(element, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Card Stagger Animation
    gsap.from(".info-item", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2, // Stagger effect
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".info-grid",
            start: "top 80%"
        }
    });

    // School Section Split Reveal
    gsap.from(".school-image", {
        x: -100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".school",
            start: "top 70%"
        }
    });

    gsap.from(".school-info > *", { // Stagger content inside info
        x: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".school",
            start: "top 60%"
        }
    });
});
