document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GET ALL THE HTML ELEMENTS ---
    const conceptTitleEl = document.getElementById('concept-title');
    const conceptSummaryEl = document.getElementById('concept-summary');
    const subConceptListEl = document.getElementById('sub-concept-list');
    const cardCollectionListEl = document.getElementById('card-collection-list');
    const exercisePromptEl = document.getElementById('exercise-prompt');
    const reflectionQuestionsEl = document.getElementById('reflection-questions');
    const naturalExercisePanelEl = document.getElementById('natural-exercise-panel'); 
    // --- 2. INITIALIZE APP STATE ---
    let navigationPath = [];
    const collectedCards = new Set();
    // Get the concept index from the URL (e.g., "?concept=1")
    const urlParams = new URLSearchParams(window.location.search);
    const conceptIndex = parseInt(urlParams.get('concept')) || 0; // Default to the first concept if none is specified
    const rootConcept = knowledgeGraph[conceptIndex]; // Select the correct concept object from the array
    const breadcrumbNavEl = document.getElementById('breadcrumb-nav');
    // --- 3. HELPER FUNCTION TO FIND A CONCEPT OBJECT FROM A PATH ---
    function findConceptByPath(path) {
        if (!path || path.length === 0) return null;
        
        let currentConcept = rootConcept;
        if (path[0] !== rootConcept.concept) return null; // Ensure the root matches

        // Traverse the path, starting from the second element
        for (let i = 1; i < path.length; i++) {
            const nextConceptName = path[i];
            const subConceptKeys = Object.keys(currentConcept).filter(key => key.includes('sub_concepts'));
            
            let found = false;
            for (const key of subConceptKeys) {
                const nextConcept = currentConcept[key].find(c => c.name === nextConceptName);
                if (nextConcept) {
                    currentConcept = nextConcept;
                    found = true;
                    break;
                }
            }
            if (!found) return null; // Path is invalid
        }
        return currentConcept;
    }

    // --- 4. HELPER FUNCTION TO UPDATE THE CARD COLLECTION VIEW ---
    function updateCardCollectionView() {
        cardCollectionListEl.innerHTML = ''; // Clear the list
        collectedCards.forEach(cardName => {
            const li = document.createElement('li');
            li.textContent = cardName;
            cardCollectionListEl.appendChild(li);
        });
    }

    // --- 5. THE MAIN RENDER FUNCTION ---
    function renderConcept(path) {
        navigationPath = path; // Update the global state
        const concept = findConceptByPath(path);

        if (!concept) {
            console.error("Concept not found for path:", path);
            return;
        }
        breadcrumbNavEl.innerHTML = '';
        path.forEach((name, index) => {
            if (index < path.length - 1) {
                const link = document.createElement('a');
                link.textContent = name;
                link.onclick = () => renderConcept(path.slice(0, index + 1));
                breadcrumbNavEl.appendChild(link);
                breadcrumbNavEl.append(' / ');
            } else {
                breadcrumbNavEl.append(name);
            }
        });
        // Add to collected cards
        collectedCards.add(concept.name || concept.concept);
        updateCardCollectionView();

        // RENDER MAIN CONTENT
        conceptTitleEl.textContent = concept.name || concept.concept;
        conceptSummaryEl.textContent = concept.summary;

        // RENDER SUB-CONCEPTS
        subConceptListEl.innerHTML = '';
        const subConceptKeys = Object.keys(concept).filter(key => key.includes('sub_concepts'));
        subConceptKeys.forEach(key => {
            concept[key].forEach(subConcept => {
                const item = document.createElement('div');
                item.className = 'sub-concept-item';
                item.innerHTML = `<h4>${subConcept.name}</h4><p>${subConcept.summary}</p>`;
                item.onclick = () => renderConcept([...path, subConcept.name]);
                subConceptListEl.appendChild(item);
            });
        });

        // RENDER NATURAL EXERCISE
        if (concept.natural_exercise) {
            // If an exercise exists, make the panel visible and populate it
            naturalExercisePanelEl.style.display = 'block';
            exercisePromptEl.textContent = concept.natural_exercise.prompt;
            reflectionQuestionsEl.innerHTML = '';
            concept.natural_exercise.reflection.forEach(q => {
                const p = document.createElement('p');
                p.textContent = `• ${q}`;
                reflectionQuestionsEl.appendChild(p);
            });
        } else {
            // If no exercise exists, hide the entire panel
            naturalExercisePanelEl.style.display = 'none';
        }
    }

    // --- 6. INITIALIZE THE APP ---
    // Start by rendering the root concept from your knowledge graph.
    renderConcept([rootConcept.concept]);
});