/*
    Conceptual Synthesizer v2.0
    A self-contained script to create an interactive concept-blending tool.
    - Uses a new, fixed set of 6 synergistic concepts.
    - Dynamically creates its own HTML.
    - No dependencies on other scripts or user actions.
*/
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NEW CONCEPT DATA ---
    const conceptsData = {
        consciousness: {
            connections: {
                creativity: "The wellspring of novelty; awareness turning its light upon the field of potential to birth new forms and ideas.",
                connection: "The recognition of a shared awareness that underlies all individual beings, forming the basis of empathy and unity.",
                technology: "An intimate feedback loop between awareness and our tools, where each elevates and refines the other, expanding perception.",
                wonder: "The pure, unfiltered awe of being, experienced when the mind quiets and consciousness simply witnesses the miracle of existence.",
                play: "The freedom of awareness to explore possibilities without attachment to outcomes, the joyful dance of the mind with itself."
            }
        },
        creativity: {
            connections: {
                connection: "Forging a bond of shared meaning and understanding through the act of making something new that resonates with others.",
                technology: "Amplifying human imagination by providing new canvases, instruments, and even AI partners for the creative process.",
                wonder: "The engine of innovation; the awe-filled 'what if?' that precedes every great leap of imagination and discovery.",
                play: "The sandbox of innovation, where rules are bent and ideas are combined without judgment, allowing novel solutions to emerge.",
            }
        },
        connection: {
            connections: {
                technology: "Weaving a global nervous system that transcends physical distance, enabling new forms of community and shared experience.",
                wonder: "The profound feeling of belonging to something larger than oneself, sparked by witnessing the interconnected beauty of reality.",
                play: "Shared, rule-bound activities that build trust, rapport, and a sense of 'us' through joyful, collaborative interaction.",
            }
        },
        technology: {
            connections: {
                wonder: "Creating tools so elegant they dissolve the boundary between the artificial and the magical, inspiring awe at human ingenuity.",
                play: "Engineering immersive worlds and interactive systems designed purely for delight, exploration, and joyful experimentation.",
            }
        },
        wonder: {
            connections: {
                play: "The spontaneous, joyful exploration of the world driven by pure curiosity and a sense of delight in the unknown.",
            }
        }
    };
    const synthesisData = {
        // --- 3-CONCEPT SYNTHESES ---
        'consciousness-creativity-connection': { name: 'Shared Imagination', description: 'The emergent space of collaborative world-building, where multiple minds link to co-create a single, unified vision.' },
        'consciousness-creativity-play': { name: 'Imaginative Flow', description: 'A state of effortless invention where the conscious mind steps aside, allowing ideas to emerge and recombine freely in a joyful, unstructured process.' },
        'consciousness-creativity-technology': { name: 'Exocortex', description: 'Technological augmentation that acts as an externalized creative partner, helping to visualize, structure, and expand upon one\'s thoughts.' },
        'consciousness-creativity-wonder': { name: 'Aesthetic Rapture', description: 'The profound, awe-filled state where the perception of beauty and the drive to create become a single, ecstatic experience.' },
        'consciousness-connection-play': { name: 'Attuned Presence', description: 'The deep, non-verbal understanding and rapport achieved between individuals who are fully present and engaged in a shared, playful activity.' },
        'consciousness-connection-technology': { name: 'The Noosphere', description: 'A planetary layer of networked consciousness, where technology enables a collective mind to become aware of itself.' },
        'consciousness-connection-wonder': { name: 'Universal Empathy', description: 'A state of profound wonder that arises from directly perceiving the interconnectedness of all consciousness, dissolving the illusion of a separate self.' },
        'consciousness-play-technology': { name: 'Lucid Virtuality', description: 'Controlling a virtual or augmented reality with the speed of thought, turning the digital world into a playground for consciousness.' },
        'consciousness-play-wonder': { name: 'Childlike Mind', description: 'A state of being where the world is perceived without preconceptions, allowing for playful exploration and a constant sense of awe.' },
        'consciousness-technology-wonder': { name: 'Sensory Expansion', description: 'Using technology to grant us new senses—like seeing magnetic fields or hearing wifi—inspiring wonder at the unseen layers of reality.' },
        'creativity-connection-play': { name: 'Jam Session', description: 'A collaborative, improvisational process where individuals build upon each other\'s ideas in a spontaneous and joyful exchange.' },
        'creativity-connection-technology': { name: 'Open Source Culture', description: 'A global, technology-enabled community dedicated to co-creating and freely sharing knowledge, tools, and art.' },
        'creativity-connection-wonder': { name: 'Collective Effervescence', description: 'The electric feeling of shared inspiration within a group, leading to creative acts and a powerful sense of unity.' },
        'creativity-play-technology': { name: 'Generative Toys', description: 'Interactive technological systems that allow users to play with complex parameters to generate unique and surprising artistic creations.' },
        'creativity-play-wonder': { name: 'Serendipity Engine', description: 'The playful, curious exploration of seemingly unrelated ideas, leading to wonderful and unexpected creative breakthroughs.' },
        'creativity-technology-wonder': { name: 'The Impossible Object', description: 'A piece of art or engineering so innovative and complex that it inspires wonder, appearing to have been created by magic rather than by hand.' },
        'connection-play-technology': { name: 'Digital Campfire', description: 'Shared virtual spaces designed not for productivity, but for fostering genuine human presence, storytelling, and collaborative joy.' },
        'connection-play-wonder': { name: 'Ritual', description: 'A structured form of play that connects a community through shared actions, invoking a sense of wonder and collective identity.' },
        'connection-technology-wonder': { name: 'The Overview Effect', description: 'A technology-mediated experience, like seeing Earth from space, that profoundly shifts one\'s perspective to a sense of planetary connection and awe.' },
        'play-technology-wonder': { name: 'The Magic Circle', description: 'An immersive, technology-driven experience so captivating that it creates a separate reality, governed by its own rules and filled with wonder.' },
        // --- 4-CONCEPT SYNTHESES ---
        'consciousness-creativity-connection-play': { name: 'Collaborative Dreaming', description: 'A state of shared consciousness, often in a playful context, where a group collectively imagines and explores new worlds and narratives together.' },
        'consciousness-creativity-connection-technology': { name: 'Hive Mind Art', description: 'Using technology to aggregate the subtle creative impulses of many individuals into a single, cohesive, and constantly evolving work of art.' },
        'consciousness-creativity-play-technology': { name: 'Mind-Sandbox', description: 'A technology that translates brainwaves directly into a responsive, playful environment, allowing for the instantaneous creation and manipulation of imagined objects.' },
        'consciousness-creativity-technology-wonder': { name: 'Cyborg Muse', description: 'A symbiotic partnership where technology enhances sensory input and cognitive flexibility, sparking wondrous new avenues for creative expression.' },
        'consciousness-connection-play-technology': { name: 'E-Sports Telepathy', description: 'A state of hyper-attunement between teammates in a fast-paced, technology-mediated game, where actions are anticipated and coordinated almost instantaneously.' },
        'consciousness-connection-technology-wonder': { name: 'Global Awakening', description: 'A potential future where technology connects humanity in a way that fosters a collective, shared consciousness, leading to a planetary sense of wonder and unity.' },
        'creativity-connection-play-technology': { name: 'Massive Collaborative Fun', description: 'Large-scale, technology-enabled creative projects disguised as games, where the playful contributions of thousands build something magnificent.' },
        'creativity-connection-technology-wonder': { name: 'The Living Archive', description: 'A dynamic, AI-curated network of all human creation, revealing wondrous, unseen connections between disparate fields of art and science.' },
        // --- 5-CONCEPT SYNTHESES ---
        'consciousness-creativity-connection-play-technology': { name: 'The Meta-Game', description: 'Designing and participating in new forms of culture; a conscious, playful, and creative use of technology to build better ways of connecting with each other.' },
        'consciousness-creativity-connection-technology-wonder': { name: 'Techno-Spiritual Renaissance', description: 'A cultural movement where technology is used to create breathtaking, shared artistic and spiritual experiences that foster both individual creativity and collective wonder.' },
        // --- 6-CONCEPT SYNTHESIS ---
        'consciousness-connection-creativity-play-technology-wonder': { name: 'Holistic Flourishing', description: 'The ultimate synthesis: Consciously using technology to foster creativity, connection, and wonder in a playful, life-affirming cycle that elevates the human experience.' }
    };

    // --- 2. DYNAMICALLY CREATE THE HTML PANEL ---
    function createSynthesizerPanel() {
        const panel = document.createElement('section');
        panel.className = 'document-content-section synthesizer-wrapper';
        panel.innerHTML = `
            <div class="synthesizer-container">
                <div class="synthesizer-header">
                    <h2>Conceptual Synthesizer</h2>
                    <p>Select multiple concepts to reveal their hidden connections.</p>
                </div>
                <div class="synthesizer-main">
                    <div class="synthesizer-nodes">
                        <svg id="connectionsCanvas"></svg>
                        <div class="concept-node" data-concept="consciousness" style="--x: 50%; --y: 10%;">Consciousness</div>
                        <div class="concept-node" data-concept="creativity" style="--x: 85%; --y: 35%;">Creativity</div>
                        <div class="concept-node" data-concept="connection" style="--x: 85%; --y: 65%;">Connection</div>
                        <div class="concept-node" data-concept="technology" style="--x: 50%; --y: 90%;">Technology</div>
                        <div class="concept-node" data-concept="wonder" style="--x: 15%; --y: 65%;">Wonder</div>
                        <div class="concept-node" data-concept="play" style="--x: 15%; --y: 35%;">Play</div>
                    </div>
                    <div id="connectionInfo" class="synthesizer-info">
                        Select two or more concepts to begin.
                    </div>
                </div>
            </div>
        `;
        const mainElement = document.querySelector('main.document-page');
        if (mainElement) {
            mainElement.insertAdjacentElement('afterend', panel);
        } else {
            document.body.appendChild(panel);
        }
    }

    // --- 4. MAIN INTERACTION LOGIC ---
    function initializeSynthesizer() {
        const concepts = document.querySelectorAll('.concept-node');
        const canvas = document.getElementById('connectionsCanvas');
        const connectionInfo = document.getElementById('connectionInfo');
        
        if (!canvas || concepts.length === 0) {
            console.error('Synthesizer elements not found. Initialization failed.');
            return;
        }

        const svgNS = "http://www.w3.org/2000/svg";
        let selectedConcepts = [];
        let resizeTimeout;

        function updateConnections() {
            canvas.innerHTML = '';
            connectionInfo.innerHTML = '';

            if (selectedConcepts.length < 2) {
                connectionInfo.textContent = selectedConcepts.length === 0 ?
                    'Select two or more concepts to begin.' :
                    'Select another concept to see its connection.';
                connectionInfo.classList.remove('active');
                return;
            }

            for (let i = 0; i < selectedConcepts.length; i++) {
                for (let j = i + 1; j < selectedConcepts.length; j++) {
                    drawConnection(selectedConcepts[i], selectedConcepts[j]);
                }
            }
            
            let key = [...selectedConcepts].sort().join('-');
            let infoHtml = '';

            if (selectedConcepts.length === 2) {
                let [c1, c2] = selectedConcepts;
                let connectionText = conceptsData[c1]?.connections[c2] || conceptsData[c2]?.connections[c1] || "A mysterious link...";
                infoHtml = `<p>${connectionText}</p>`;
            } else {
                let synthesis = synthesisData[key];
                if (synthesis) {
                    infoHtml = `
                        <div class="synthesis-title">SYNTHESIS: <span>${synthesis.name}</span></div>
                        <p class="synthesis-description">${synthesis.description}</p>
                    `;
                } else {
                    infoHtml = `<p>A complex web of ${selectedConcepts.length} ideas. No specific synthesis found for this combination.</p>`;
                }
            }
            connectionInfo.innerHTML = infoHtml;
            connectionInfo.classList.add('active');
        }

        function drawConnection(concept1, concept2) {
            const node1 = document.querySelector(`[data-concept="${concept1}"]`);
            const node2 = document.querySelector(`[data-concept="${concept2}"]`);
            if (!node1 || !node2) return;

            const r1 = node1.getBoundingClientRect();
            const r2 = node2.getBoundingClientRect();
            const containerR = canvas.getBoundingClientRect();

            const x1 = r1.left + r1.width / 2 - containerR.left;
            const y1 = r1.top + r1.height / 2 - containerR.top;
            const x2 = r2.left + r2.width / 2 - containerR.left;
            const y2 = r2.top + r2.height / 2 - containerR.top;

            const path = document.createElementNS(svgNS, 'path');
            path.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
            path.setAttribute('stroke', 'var(--accent-gold, #cdaA71)');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            canvas.appendChild(path);
        }

        concepts.forEach(concept => {
            concept.addEventListener('click', () => {
                const conceptName = concept.dataset.concept;
                if (concept.classList.contains('connected')) {
                    concept.classList.remove('connected');
                    selectedConcepts = selectedConcepts.filter(c => c !== conceptName);
                } else {
                    concept.classList.add('connected');
                    selectedConcepts.push(conceptName);
                }
                updateConnections();
            });
        });

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateConnections, 100);
        });
    }

    // --- 5. INITIALIZE THE FEATURE ---
    createSynthesizerPanel();
    // Removed the call to injectSynthesizerStyles()
    initializeSynthesizer();
});