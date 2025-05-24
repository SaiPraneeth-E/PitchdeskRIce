document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const modals = document.querySelectorAll('.modal');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    let navbarHeight = navbar ? navbar.offsetHeight : 70;
    const mainContainer = document.querySelector('.main-container');
    const slidesContainer = document.querySelector('.slides-container');
    const rootLogo = document.querySelector('.root-logo');
    const branchLine = document.querySelector('.main-container .branch-line');
    const endNodeThankYou = document.querySelector('.end-node-thank-you');

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function updateNavbarHeight() {
        if (navbar) navbarHeight = navbar.offsetHeight;
        if (mainContainer) mainContainer.style.marginTop = `${navbarHeight}px`;
    }

    function updateTimelineElements() {
        updateNavbarHeight();
        const allSlides = Array.from(document.querySelectorAll('.slides-container .slide'));
        const branchNodes = Array.from(document.querySelectorAll('.slides-container .branch-node'));

        if (!rootLogo || !branchLine || !slidesContainer || !endNodeThankYou || !mainContainer) {
            if (branchLine) branchLine.style.height = '0px';
            return;
        }

        const branchLineTopOrigin = rootLogo.offsetTop + rootLogo.offsetHeight; // Bottom edge of rootLogo
        branchLine.style.top = `${branchLineTopOrigin}px`;

        // Position all orange branch nodes
        allSlides.forEach((slide, index) => {
            if (branchNodes[index]) {
                const branchNodeHeight = branchNodes[index].offsetHeight;
                // nodeTopInSlidesContainer is the top edge of the orange node
                const nodeTopInSlidesContainer = slide.offsetTop + (slide.offsetHeight / 2) - (branchNodeHeight / 2);
                branchNodes[index].style.top = `${nodeTopInSlidesContainer}px`;

                if (window.innerWidth > 768) { // Desktop
                    branchNodes[index].style.left = '50%';
                    branchNodes[index].style.transform = 'translateX(-50%)';
                    branchNodes[index].style.setProperty('--translateX-node', '-50%'); // ensure CSS var for hover consistency
                } else { // Mobile - CSS handles left and transform, just set the CSS var
                    branchNodes[index].style.setProperty('--translateX-node', '-50%');
                }
            }
        });

        // --- Position the "Thank You" node ---
        let thankYouNodeTargetCenterY_main;
        const slide11Element = document.getElementById('vision');
        const slide12Element = document.getElementById('tagline');
        let desiredGap = 120; // Default center-to-center gap

        if (slide11Element && slide12Element && allSlides.includes(slide11Element) && allSlides.includes(slide12Element)) {
            const slide11Index = allSlides.indexOf(slide11Element);
            const slide12Index = allSlides.indexOf(slide12Element);

            if (branchNodes[slide11Index] && branchNodes[slide12Index]) {
                const orangeNode11 = branchNodes[slide11Index];
                const orangeNode12 = branchNodes[slide12Index];

                const orangeNode11_center_Y_slides = orangeNode11.offsetTop + (orangeNode11.offsetHeight / 2);
                const orangeNode12_center_Y_slides = orangeNode12.offsetTop + (orangeNode12.offsetHeight / 2);

                const calculatedGap = orangeNode12_center_Y_slides - orangeNode11_center_Y_slides;

                if (calculatedGap > 20) {
                    desiredGap = calculatedGap;
                }

                const orangeNode12_center_Y_main = slidesContainer.offsetTop + orangeNode12_center_Y_slides;
                thankYouNodeTargetCenterY_main = orangeNode12_center_Y_main + desiredGap;
            }
        }

        if (thankYouNodeTargetCenterY_main === undefined) {
            if (branchNodes.length > 0) {
                const lastOrangeNode = branchNodes[branchNodes.length - 1];
                const lastOrangeNode_center_Y_main = slidesContainer.offsetTop + lastOrangeNode.offsetTop + (lastOrangeNode.offsetHeight / 2);
                thankYouNodeTargetCenterY_main = lastOrangeNode_center_Y_main + desiredGap;
            } else {
                const rootLogo_center_Y_main = rootLogo.offsetTop + (rootLogo.offsetHeight / 2);
                thankYouNodeTargetCenterY_main = rootLogo_center_Y_main + (desiredGap + 30);
            }
        }

        endNodeThankYou.style.top = `${thankYouNodeTargetCenterY_main - (endNodeThankYou.offsetHeight / 2)}px`;

        if (window.innerWidth > 768) {
            endNodeThankYou.style.left = '50%';
            endNodeThankYou.style.transform = 'translateX(-50%)';
             endNodeThankYou.style.setProperty('--translateX', '-50%');
        } else { // Mobile - CSS handles left and transform, just set the CSS var
             endNodeThankYou.style.setProperty('--translateX', '-50%');
        }


        // --- Calculate main branch line height ---
        const endNodeThankYouTop_val = parseFloat(endNodeThankYou.style.top);
        let branchLineEndTargetY_main;

        if (!isNaN(endNodeThankYouTop_val)) {
            branchLineEndTargetY_main = endNodeThankYouTop_val + (endNodeThankYou.offsetHeight / 2);
        } else {
            branchLineEndTargetY_main = thankYouNodeTargetCenterY_main || (branchLineTopOrigin + 100);
        }

        const requiredBranchLineHeight = branchLineEndTargetY_main - branchLineTopOrigin;
        branchLine.style.height = `${Math.max(0, requiredBranchLineHeight)}px`;

        if (slidesContainer && allSlides.length > 0) {
            const lastNodeInContainer = branchNodes[branchNodes.length - 1];
            if (lastNodeInContainer) {
                const lastNodeBottomEdgeInSlidesContainer = lastNodeInContainer.offsetTop + lastNodeInContainer.offsetHeight;
                const currentPaddingBottom = parseFloat(getComputedStyle(slidesContainer).paddingBottom);
                const desiredPaddingBottom = 60;

                const minContentHeightWithMargin = lastNodeBottomEdgeInSlidesContainer + desiredPaddingBottom;
                const currentContentHeightWithoutPadding = slidesContainer.scrollHeight - currentPaddingBottom;

                if (minContentHeightWithMargin > currentContentHeightWithoutPadding) {
                   slidesContainer.style.paddingBottom = `${minContentHeightWithMargin - currentContentHeightWithoutPadding + currentPaddingBottom}px`;
                } else if (currentPaddingBottom < desiredPaddingBottom) {
                   slidesContainer.style.paddingBottom = `${desiredPaddingBottom}px`;
                }
            }
        } else if (slidesContainer) {
            slidesContainer.style.paddingBottom = `60px`;
        }
    }

    updateNavbarHeight();
    setTimeout(() => { updateTimelineElements(); setTimeout(updateTimelineElements, 350); }, 150);
    window.addEventListener('load', () => { updateNavbarHeight(); updateTimelineElements(); updateActiveLink(); });
    window.addEventListener('resize', debounce(() => { updateNavbarHeight(); updateTimelineElements(); updateActiveLink(); }, 150));

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, observerOptions);
    slides.forEach(slide => slideObserver.observe(slide));

    if (endNodeThankYou) {
        const endNodeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                 entry.target.classList.toggle('visible', entry.isIntersecting);
                 if (entry.isIntersecting) updateTimelineElements();
            });
        }, { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.05 });
        endNodeObserver.observe(endNodeThankYou);
    }

    slides.forEach(slide => {
        slide.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            const modalId = slide.getAttribute('data-modal-id');
            const modal = document.getElementById(modalId);
            if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal') || e.target.closest('.close-modal')) {
                modal.classList.remove('active'); document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) { activeModal.classList.remove('active'); document.body.style.overflow = ''; }
        }
    });

    function updateActiveLink() {
        let currentSectionId = '';
        const scrollTriggerOffset = navbarHeight + (window.innerHeight * 0.35);
        const scrollPosition = window.scrollY + scrollTriggerOffset;
        const introSection = document.querySelector('.intro-section');

        if (introSection && window.scrollY < (introSection.offsetHeight - (navbarHeight*1.5) )) {
             currentSectionId = navLinks[0] ? navLinks[0].getAttribute('href').substring(1) : 'what-we-do';
        } else {
            const slidesContainerTopOffset = (mainContainer ? mainContainer.offsetTop : 0) + (slidesContainer ? slidesContainer.offsetTop : 0);
            let foundActive = false;
            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                const slideAbsoluteTop = slide.offsetTop + slidesContainerTopOffset;
                if (scrollPosition >= slideAbsoluteTop && scrollPosition < (slideAbsoluteTop + slide.offsetHeight) ) {
                    currentSectionId = slide.id; foundActive = true; break;
                }
                if (scrollPosition >= (slideAbsoluteTop + (slide.offsetHeight / 2))) {
                    currentSectionId = slide.id; foundActive = true;
                } else if (foundActive) { break; }
            }
            if (!foundActive && slides.length > 0 && scrollPosition > (slides[slides.length-1].offsetTop + slidesContainerTopOffset + slides[slides.length-1].offsetHeight)) {
                 currentSectionId = slides[slides.length-1].id;
            }
        }

        if ((window.innerHeight + Math.ceil(window.scrollY) + 10) >= document.body.offsetHeight ) {
             const lastNavLinkHref = navLinks[navLinks.length-1].getAttribute('href');
             if(lastNavLinkHref) currentSectionId = lastNavLinkHref.substring(1);
        }

        let activeLinkSet = false;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active'); activeLinkSet = true;
            }
        });
        if(!activeLinkSet && navLinks.length > 0){ navLinks[0].classList.add('active'); }
    }

    window.addEventListener('scroll', debounce(updateActiveLink, 70));
    updateActiveLink();

    const yearSpan = document.getElementById('currentYear');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();
});