document.addEventListener('DOMContentLoaded', function() {
    // ----------------------------------------------------
    // 1. Navigation & Smooth Scroll Snap Transitions
    // ----------------------------------------------------
    const scrollContainer = document.getElementById('scrollContainer');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-view');
    const navTriggers = document.querySelectorAll('.nav-trigger-btn, .scroll-down-indicator');

    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            scrollToSection(target);
        });
    });

    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            scrollToSection(target);
        });
    });

    // ----------------------------------------------------
    // 2. Active Navigation Tab Highlighting
    // ----------------------------------------------------
    const sectionObserverOptions = {
        root: scrollContainer,
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-target') === activeId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ----------------------------------------------------
    // 3. Parallax Background Scroll Translator
    // ----------------------------------------------------
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', function() {
            const scrollTop = scrollContainer.scrollTop;
            
            document.querySelectorAll('.parallax-section').forEach(section => {
                const sectionTop = section.offsetTop;
                const relativeScroll = scrollTop - sectionTop;
                
                const bgLayer = section.querySelector('.parallax-bg-layer');
                if (bgLayer) {
                    bgLayer.style.transform = `translateY(${relativeScroll * 0.20}px)`;
                }
            });
        });
    }

    // ----------------------------------------------------
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ----------------------------------------------------
    const revealObserverOptions = {
        root: scrollContainer,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });


    // ----------------------------------------------------
    // 5. Music Controller Setup
    // ----------------------------------------------------
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isMusicPlaying = false;

    function playMusic() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.querySelector('.music-icon').textContent = '🎵';
            musicToggle.classList.add('playing');
        }).catch(err => {
            console.log("Autoplay blocked. Awaiting user interaction.");
        });
    }

    musicToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggle.querySelector('.music-icon').textContent = '🔇';
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.play();
            isMusicPlaying = true;
            musicToggle.querySelector('.music-icon').textContent = '🎵';
            musicToggle.classList.add('playing');
        }
    });

    document.body.addEventListener('click', function() {
        if (!isMusicPlaying) {
            playMusic();
        }
    }, { once: true });


    // ----------------------------------------------------
    // 6. Wedding Countdown Timer (Dynamic)
    // ----------------------------------------------------
    const countdownSection = document.getElementById('page-countdown');
    const targetDateString = countdownSection ? countdownSection.getAttribute('data-countdown') : '2026-12-30T10:58:00';
    const targetDate = new Date(targetDateString).getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();


    // ----------------------------------------------------
    // 7. RSVP Submission & WhatsApp Click-to-Chat Redirect
    // ----------------------------------------------------
    const rsvpForm = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const rsvpMessage = document.getElementById('rsvpMessage');
    
    const rsvpYesRadio = document.getElementById('rsvp-yes');
    const rsvpNoRadio = document.getElementById('rsvp-no');
    const mealPreferenceWrap = document.getElementById('meal-preference-wrap');
    const dietaryWrap = document.getElementById('dietary-wrap');
    const mealPreferenceSelect = document.getElementById('meal_preference');

    function toggleRsvpFields() {
        if (rsvpNoRadio.checked) {
            mealPreferenceWrap.style.display = 'none';
            dietaryWrap.style.display = 'none';
            mealPreferenceSelect.required = false;
        } else {
            mealPreferenceWrap.style.display = 'block';
            dietaryWrap.style.display = 'block';
            mealPreferenceSelect.required = true;
        }
    }

    if (rsvpYesRadio && rsvpNoRadio) {
        rsvpYesRadio.addEventListener('change', toggleRsvpFields);
        rsvpNoRadio.addEventListener('change', toggleRsvpFields);
        toggleRsvpFields();
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();

            rsvpMessage.textContent = '';
            rsvpMessage.className = 'form-status-msg';

            const name = document.getElementById('name').value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked').value;
            const mealPreference = (attendance === 'accept') ? mealPreferenceSelect.value : 'N/A';
            const dietaryRestrictions = (attendance === 'accept') ? document.getElementById('dietary_restrictions').value.trim() : 'N/A';

            const actionUrl = rsvpForm.getAttribute('data-action');
            const whatsappNumber = rsvpForm.getAttribute('data-whatsapp');
            const coupleNames = rsvpForm.getAttribute('data-couple');

            submitBtn.disabled = true;
            btnSpinner.style.display = 'inline-block';
            submitBtn.querySelector('.btn-lbl').textContent = 'SUBMITTING...';

            const payload = {
                name: name,
                attendance: attendance,
                meal_preference: mealPreference,
                dietary_restrictions: dietaryRestrictions
            };

            fetch(actionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) throw new Error('Server response failed');
                return response.json();
            })
            .then(res => {
                if (res.status === 'success') {
                    rsvpMessage.textContent = 'ස්තූතියි! RSVP එක සාර්ථකයි. WhatsApp හරහා තහවුරු කිරීමට සූදානම් වේ... (RSVP saved. Redirecting to WhatsApp...)';
                    rsvpMessage.classList.add('success');
                    
                    let wsMessage = `Hi ${coupleNames}! 🌸\n\nI have submitted my RSVP to your wedding invitation:\n\n`;
                    wsMessage += `*Name:* ${name}\n`;
                    if (attendance === 'accept') {
                        wsMessage += `*Attendance:* Joyfully Accepts 💚\n`;
                        
                        let mealDesc = 'Not Chosen';
                        if (mealPreference === 'chicken') mealDesc = 'Chicken Menu 🍗';
                        else if (mealPreference === 'fish') mealDesc = 'Fish Menu 🐟';
                        else if (mealPreference === 'veg') mealDesc = 'Vegetarian Menu 🥦';
                        
                        wsMessage += `*Meal Preference:* ${mealDesc}\n`;
                        if (dietaryRestrictions && dietaryRestrictions !== 'N/A') {
                            wsMessage += `*Dietary Restrictions:* ${dietaryRestrictions}\n`;
                        }
                    } else {
                        wsMessage += `*Attendance:* Regretfully Declines 💔\n`;
                    }
                    wsMessage += `\nLooking forward to celebrating with you! ✨`;

                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(wsMessage)}`;
                    
                    rsvpForm.reset();
                    toggleRsvpFields();

                    setTimeout(() => {
                        const openedWindow = window.open(whatsappUrl, '_blank');
                        if (!openedWindow) {
                            window.location.href = whatsappUrl;
                        }
                    }, 500);

                } else {
                    rsvpMessage.textContent = `Error: ${res.message}`;
                    rsvpMessage.classList.add('error');
                }
            })
            .catch(err => {
                console.error('RSVP submission error:', err);
                rsvpMessage.textContent = 'සබඳතා දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න. (Connection error. Please try again.)';
                rsvpMessage.classList.add('error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                btnSpinner.style.display = 'none';
                submitBtn.querySelector('.btn-lbl').textContent = 'SUBMIT RSVP 🐚';
            });
        });
    }
});
