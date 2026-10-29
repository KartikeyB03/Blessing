const BIRTHDAY_NAME = "Kartikey";

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const curtain = document.querySelector("#curtain");
        const canvas = document.querySelector("#confetti");
        const context = canvas.getContext("2d");
        let confettiPieces = [];
        let confettiFrame = 0;

        document.title = `Happy Birthday, ${BIRTHDAY_NAME}!`;
        document.querySelector("#hero-name").textContent = BIRTHDAY_NAME;
        document.querySelectorAll(".name-slot").forEach((slot) => { slot.textContent = BIRTHDAY_NAME; });

        function fitCanvas() {
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(window.innerWidth * ratio);
            canvas.height = Math.round(window.innerHeight * ratio);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }
        fitCanvas();
        window.addEventListener("resize", fitCanvas, { passive: true });

        function burstConfetti(originX = window.innerWidth / 2, originY = window.innerHeight * .42, amount = 100) {
            if (reducedMotion.matches) return;
            const palette = ["#ff8fab", "#ffc4a8", "#a8e6cf", "#c3a6ff", "#8fd3f4", "#fff0b3"];
            for (let index = 0; index < amount; index += 1) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 6;
                confettiPieces.push({ x: originX, y: originY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, size: 3 + Math.random() * 5, rotation: Math.random() * 6, spin: (Math.random() - .5) * .22, color: palette[index % palette.length], life: 75 + Math.random() * 45 });
            }
            if (!confettiFrame) confettiFrame = requestAnimationFrame(drawConfetti);
        }

        function drawConfetti() {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            confettiPieces = confettiPieces.filter((piece) => piece.life > 0 && piece.y < window.innerHeight + 20);
            for (const piece of confettiPieces) {
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.vy += .11;
                piece.vx *= .994;
                piece.rotation += piece.spin;
                piece.life -= 1;
                context.save();
                context.translate(piece.x, piece.y);
                context.rotate(piece.rotation);
                context.globalAlpha = Math.min(1, piece.life / 18);
                context.fillStyle = piece.color;
                context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * .72);
                context.restore();
            }
            if (confettiPieces.length) confettiFrame = requestAnimationFrame(drawConfetti);
            else { confettiFrame = 0; context.clearRect(0, 0, window.innerWidth, window.innerHeight); }
        }

        function makeHeadingLetters() {
            const heading = document.querySelector("#birthday-title");
            heading.replaceChildren();
            let letterIndex = 0;
            ["Happy Birthday,", `${BIRTHDAY_NAME}!`].forEach((lineText) => {
                const line = document.createElement("span");
                line.className = "hero-title-line";
                [...lineText].forEach((character) => {
                    const letter = document.createElement("span");
                    letter.className = "letter";
                    letter.style.setProperty("--delay", `${letterIndex * 35}ms`);
                    letter.textContent = character === " " ? "\u00a0" : character;
                    line.append(letter);
                    letterIndex += 1;
                });
                heading.append(line);
            });
        }

        document.querySelector("#open-party").addEventListener("click", () => {
            if (curtain.classList.contains("is-opening")) return;
            document.body.classList.add("party-open");
            makeHeadingLetters();
            curtain.classList.add("is-opening");
            burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 115);
            window.setTimeout(() => {
                curtain.classList.add("is-gone");
                document.querySelector("#site").inert = false;
            }, reducedMotion.matches ? 650 : 1550);
        });

        document.querySelector("#blow-candles").addEventListener("click", (event) => {
            const button = event.currentTarget;
            if (button.disabled) return;
            button.disabled = true;
            const cakeArea = document.querySelector("#cake-area");
            cakeArea.classList.add("wind-active");
            document.querySelector("#cake-subtitle").textContent = "Your wish is on its way!";
            const delay = reducedMotion.matches ? 100 : 350;
            [1, 2, 3].forEach((number, index) => {
                window.setTimeout(() => {
                    document.querySelector(`#flame-${number}`).classList.add("is-out");
                    document.querySelector(`#smoke-${number}`).classList.add("is-visible");
                }, delay + index * (reducedMotion.matches ? 180 : 350));
            });
            window.setTimeout(() => burstConfetti(window.innerWidth / 2, window.innerHeight * .42, 105), reducedMotion.matches ? 350 : 850);
            window.setTimeout(() => {
                cakeArea.classList.remove("wind-active");
                document.querySelector("#scroll-hint").classList.add("is-visible");
            }, reducedMotion.matches ? 1500 : 2950);
        });

        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: .22 });
        document.querySelectorAll(".blessing-item").forEach((item) => cardObserver.observe(item));
        document.querySelectorAll(".flip-card").forEach((card) => {
            card.addEventListener("click", () => {
                const isOpen = card.getAttribute("aria-pressed") === "true";
                card.setAttribute("aria-pressed", String(!isOpen));
                card.setAttribute("aria-label", `${isOpen ? "Open" : "Close"} ${card.dataset.label || "blessing card"}`);
                const cardItem = card.closest(".blessing-item");
                let fireworks = cardItem.querySelector(".card-fireworks");
                if (!fireworks) {
                    fireworks = document.createElement("span");
                    fireworks.className = "card-fireworks";
                    fireworks.setAttribute("aria-hidden", "true");
                    cardItem.prepend(fireworks);
                }
                fireworks.replaceChildren();
                fireworks.classList.remove("is-bursting");
                void fireworks.offsetWidth;
                fireworks.classList.add("is-bursting");
                const colors = ["#f2779a", "#e5a84c", "#72bfa6", "#9b83d4", "#62b9df"];
                const particleCount = reducedMotion.matches ? 10 : 18;
                for (let index = 0; index < particleCount; index += 1) {
                    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * .22;
                    const distance = (reducedMotion.matches ? 70 : 100) + Math.random() * (reducedMotion.matches ? 24 : 62);
                    const sparkle = document.createElement("span");
                    sparkle.className = "card-firework";
                    sparkle.textContent = index % 3 === 0 ? "✦" : index % 3 === 1 ? "·" : "✧";
                    sparkle.style.setProperty("--sparkle-x", `${Math.cos(angle) * distance}px`);
                    sparkle.style.setProperty("--sparkle-y", `${Math.sin(angle) * distance}px`);
                    sparkle.style.setProperty("--sparkle-color", colors[index % colors.length]);
                    sparkle.style.setProperty("--sparkle-size", `${reducedMotion.matches ? 14 : 18 + Math.random() * 8}px`);
                    fireworks.append(sparkle);
                }
                window.setTimeout(() => {
                    fireworks.replaceChildren();
                    fireworks.classList.remove("is-bursting");
                }, 1400);
            });
        });
        document.querySelectorAll(".flip-card").forEach((card, index) => { card.dataset.label = ["heart", "star", "flower", "moon"][index]; });

        function addHearts() {
            if (reducedMotion.matches) return;
            const symbols = ["♥", "♡", "✦"];
            for (let index = 0; index < 9; index += 1) {
                const heart = document.createElement("span");
                heart.textContent = symbols[index % symbols.length];
                heart.setAttribute("aria-hidden", "true");
                Object.assign(heart.style, { position: "fixed", zIndex: "8", left: `${38 + Math.random() * 24}%`, top: `${54 + Math.random() * 10}%`, color: ["#f47f9e", "#e3a34e", "#9b83d4"][index % 3], fontSize: `${16 + Math.random() * 15}px`, pointerEvents: "none", transition: "transform 1.8s ease-out, opacity 1.8s ease-out" });
                document.body.append(heart);
                requestAnimationFrame(() => { heart.style.transform = `translate(${(Math.random() - .5) * 170}px, -190px) rotate(${Math.random() * 100 - 50}deg)`; heart.style.opacity = "0"; });
                window.setTimeout(() => heart.remove(), 1900);
            }
        }

        function burstWishFireworks(originX, originY) {
            const burst = document.createElement("span");
            burst.className = "wish-arrival-burst";
            burst.setAttribute("aria-hidden", "true");
            burst.style.left = `${originX}px`;
            burst.style.top = `${originY}px`;
            const colors = ["#fff0a8", "#ff8fab", "#a8e6cf", "#8fd3f4", "#ffc4a8"];
            const particleCount = reducedMotion.matches ? 60 : 100;
            const burstDiameter = reducedMotion.matches ? 900 : 1000000;
            const rayHalfLength = reducedMotion.matches ? 50 : 125;
            const minDistance = reducedMotion.matches ? 70 : 120;
            const maxDistance = burstDiameter / 2 - rayHalfLength;
            for (let index = 0; index < particleCount; index += 1) {
                const angle = (Math.PI * 2 * index) / particleCount + Math.random() * .16;
                const distance = minDistance + Math.random() * (maxDistance - minDistance);
                const particle = document.createElement("span");
                particle.className = "wish-arrival-particle";
                particle.textContent = index % 2 ? "✦" : "·";
                particle.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
                particle.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
                particle.style.setProperty("--spark-angle", `${angle + Math.PI / 2}rad`);
                particle.style.setProperty("--sparkle-color", colors[index % colors.length]);
                particle.style.setProperty("--sparkle-size", `${reducedMotion.matches ? 100 : 180 + Math.random() * 70}px`);
                burst.append(particle);
            }
            document.body.append(burst);
            window.setTimeout(() => burst.remove(), reducedMotion.matches ? 7000 : 10000);
        }

        const giftStage = document.querySelector("#gift-stage");
        document.querySelector("#gift-trigger").addEventListener("click", (event) => {
            if (giftStage.classList.contains("is-open") || giftStage.classList.contains("is-opening")) return;
            const trigger = event.currentTarget;
            giftStage.classList.add("is-opening");
            trigger.setAttribute("aria-expanded", "true");
            window.setTimeout(() => {
                giftStage.classList.remove("is-opening");
                giftStage.classList.add("is-open");
                burstConfetti(window.innerWidth / 2, window.innerHeight * .62, 85);
                addHearts();
            }, reducedMotion.matches ? 550 : 1200);
        });

        const sky = document.querySelector("#night-sky");
        for (let index = 0; index < 38; index += 1) {
            const star = document.createElement("span");
            star.className = "night-star";
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 78}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.opacity = `${.35 + Math.random() * .65}`;
            sky.append(star);
        }

        document.querySelector("#send-wish").addEventListener("click", (event) => {
            const button = event.currentTarget;
            if (button.disabled) return;
            button.disabled = true;
            const finale = document.querySelector("#finale");
            const sparkleLayer = document.querySelector("#wish-sparkle-layer");
            document.body.append(sparkleLayer);
            finale.classList.add("is-wishing", "is-multi-wishing");
            const starCount = reducedMotion.matches ? 10 : 30;
            const baseDuration = reducedMotion.matches ? 1300 : 2500;
            const maxStagger = reducedMotion.matches ? 250 : 850;
            const travelingStars = [];
            const destinations = [];
            let flightEnd = 0;

            for (let index = 0; index < starCount; index += 1) {
                const startX = 24 + Math.random() * (window.innerWidth - 48);
                const startY = 24 + Math.random() * (window.innerHeight - 48);
                const endX = window.innerWidth * (.08 + Math.random() * .84);
                const endY = window.innerHeight * (.08 + Math.random() * .76);
                const delay = Math.random() * maxStagger;
                const duration = baseDuration * (.82 + Math.random() * .36);
                const star = document.createElement("span");
                star.className = "wish-travel-star";
                star.textContent = "★";
                star.setAttribute("aria-hidden", "true");
                star.style.left = `${startX}px`;
                star.style.top = `${startY}px`;
                star.style.setProperty("--wish-dx", `${endX - startX}px`);
                star.style.setProperty("--wish-dy", `${endY - startY}px`);
                star.style.setProperty("--wish-star-size", `${14 + Math.random() * 14}px`);
                star.style.setProperty("--wish-flight-duration", `${duration}ms`);
                star.style.setProperty("--wish-flight-delay", `${delay}ms`);
                document.body.append(star);
                travelingStars.push(star);
                destinations.push({ x: endX, y: endY, arrival: delay + duration });
                flightEnd = Math.max(flightEnd, delay + duration);
                window.setTimeout(() => {
                    if (star.isConnected) star.classList.add("is-fading");
                }, delay + duration + 40);
            }

            destinations.forEach((destination) => {
                window.setTimeout(() => {
                    burstWishFireworks(destination.x, destination.y);
                    burstConfetti(destination.x, destination.y, reducedMotion.matches ? 8 : 14);
                }, destination.arrival);
            });

            let lastSparkle = 0;
            const flightStarted = performance.now();
            const leaveSparkleTrail = (now) => {
                if (now - lastSparkle >= (reducedMotion.matches ? 115 : 85)) {
                    lastSparkle = now;
                    const star = travelingStars[Math.floor(Math.random() * travelingStars.length)];
                    const starBounds = star.getBoundingClientRect();
                    if (starBounds.width > 0) {
                        const sparkle = document.createElement("span");
                        sparkle.className = "wish-sparkle";
                        sparkle.textContent = Math.random() > .25 ? "✦" : "✧";
                        sparkle.style.left = `${starBounds.left + starBounds.width / 2}px`;
                        sparkle.style.top = `${starBounds.top + starBounds.height / 2}px`;
                        sparkle.style.setProperty("--sparkle-drift", `${(Math.random() - .5) * 54}px`);
                        sparkleLayer.append(sparkle);
                        window.setTimeout(() => sparkle.remove(), 1800);
                    }
                }
                if (now - flightStarted < flightEnd) requestAnimationFrame(leaveSparkleTrail);
            };
            requestAnimationFrame(leaveSparkleTrail);
            window.setTimeout(() => {
                document.querySelector("#final-message").classList.add("is-visible");
                window.setTimeout(() => travelingStars.forEach((star) => star.remove()), 1800);
            }, flightEnd);
        });

        function updateScrollUI() {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            document.querySelector("#progress-bar").style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
        }
        window.addEventListener("scroll", updateScrollUI, { passive: true });
        updateScrollUI();

        const navLinks = [...document.querySelectorAll(".section-nav a")];
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
                    else link.removeAttribute("aria-current");
                });
            });
        }, { rootMargin: "-38% 0px -38% 0px" });
        document.querySelectorAll(".section").forEach((section) => sectionObserver.observe(section));

        const balloonLayer = document.querySelector("#balloon-layer");
        const balloonColors = ["#ff9bb2", "#ffc89f", "#a9dfca", "#c3a6ff", "#91d4ef"];
        function addBalloon() {
            if (!document.body.classList.contains("party-open") || reducedMotion.matches || document.hidden) return;
            const balloon = document.createElement("button");
            balloon.className = "balloon";
            balloon.type = "button";
            balloon.setAttribute("aria-label", "Pop floating balloon");
            balloon.style.left = `${Math.random() * 92}%`;
            balloon.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
            balloon.style.borderTopColor = balloon.style.background;
            balloon.style.setProperty("--duration", `${11 + Math.random() * 8}s`);
            balloon.addEventListener("click", () => { balloon.classList.add("is-popped"); window.setTimeout(() => balloon.remove(), 220); });
            balloon.addEventListener("animationend", () => balloon.remove(), { once: true });
            balloonLayer.append(balloon);
            window.setTimeout(() => balloon.remove(), 20000);
        }
        window.setInterval(addBalloon, 2400);
