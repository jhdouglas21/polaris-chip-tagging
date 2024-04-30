import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQuestion extends DDD {

    static get tag() {
        return 'tagging-question';
    }

    constructor() {
        super();
        this.dragging = null;
        this.message = "";
        this.imageUrl = "";
        this.question = "";
        this.items = {}; 
        this.draggableElements = [];
        this.source = new URL('../src/tags.json', import.meta.url).href;
        this.answerSet = "default";
    }

    static get properties() {
        return {
            message: { type: String },
            imageUrl: { type: String },
            question: { type: String },
            answerSet: { type: String },
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
    }

    async fetchData() {
        try {
            const response = await fetch(this.source);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            
            // Check if the answer set exists in the data
            if (data.hasOwnProperty(this.answerSet)) {
                // Flatten nested objects and extract keys (titles) for the specified answer set
                this.items = Object.entries(data[this.answerSet])
                    .reduce((acc, [title, details]) => {
                        acc[title] = details;
                        return acc;
                    }, {});
            } else {
                console.error(`Answer set '${this.answerSet}' not found in the data.`);
            }
    
            this.requestUpdate(); // Trigger render after data is fetched
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    render() {
        return html`
        <confetti-container id="confetti">
            <div class="tag-question">
                <div class="header">
                    <h2>Tagging</h2>
                </div>
                <img class="image" src=${this.imageUrl} alt="Image"/>
                <details class="description" @toggle="${this.openChanged}">
                    <summary>Description</summary>
                    <h4>${this.question}</h4>
                    <div>
                        <slot>${this.message}</slot>
                    </div>
                </details>

                <div class="draggable-container">
                    ${Object.entries(this.items).map(([key, value]) => html`
                        <div class="draggable-content" draggable="true" @dragstart="${this.dragStart}" data-key="${key}">
                            ${key}
                        </div>
                    `)}
                </div>

                </div>
                <div class="feedback-container">
                </div>

                <div class="empty-boxes" @dragover=${this.dragOver} @dragenter=${this.dragEnter} @dragleave=${this.dragLeave} @drop=${this.dragDrop}>
                    <div class="empty"></div>
                </div>

                <div class="controls">
                    <button class="check" @click="${this.checkAnswers}">Check</button>
                    <button class="reset" @click="${this.reset}">Reset</button>
                </div>
            </div>
            </confetti-container>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .description {
                color: var(--ddd-theme-default-creekTeal);
            }

            .controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
                padding: 10px;
            }

            .controls button {
                margin-right: 10px;
            }

            .check {
                background-color: var(--ddd-theme-default-opportunityGreen);
                color: var(--ddd-theme-default-white); 
                padding: 10px 20px;
                border-radius: 5px; 
                cursor: pointer; 
            }

            .reset {
                background-color: var(--ddd-theme-default-original87Pink);
                color: var(--ddd-theme-default-white); 
                padding: 10px 20px;
                border-radius: 5px; 
                cursor: pointer; 
            }

            .image {
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 50%;
            }

            .header {
                color: var(--ddd-theme-default-futureLime);
                font-size: 250%;
                text-align: center;
            }

            .tag-question {
                background: var(--ddd-theme-default-coalyGray);
            }

            .draggable-container {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 20px;
                justify-content: center; 
            }

            .draggable-content {
                background-color: var(--ddd-theme-default-athertonViolet);
                cursor: pointer;
                margin: 5px;
                flex: 0 0 auto; 
                display: inline-block; 
                padding: 5px 10px; 
                border-radius: 5px; 
                white-space: nowrap; 
            }

            .draggable-content:hover {
                outline: 2px solid var(--ddd-theme-default-accent);
            }

            .empty-boxes {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }

            .empty {
                justify-content: center;
                align-items: center;
                min-height: 120px; 
                min-width: 360px;
                display: inline-flex;
                margin: 10px;
                padding: 10px;
                border: solid 3px var(--ddd-theme-default-discoveryCoral);
                background: grey;
            }

            .hovered {
                background: var(--ddd-theme-default-roarMaxlight);
                border-style: dashed;
            }
        `;
    }

    openChanged(e) {
        console.log(e.newState);
      }

    dragStart(e) {
        this.dragging = e.target;
        this.dragging.classList.add('hold');
        setTimeout(() => (this.dragging.classList.add('invisible')), 0);
    }

    dragEnd() {
        if (this.dragging) {
            this.dragging.classList.remove('hold', 'invisible');
        }
    }

    dragOver(e) {
        e.preventDefault();
    }

    dragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('empty')) {
            e.target.classList.add('hovered');
        }
    }

    dragLeave(e) {
        if (e.target.classList.contains('empty')) {
            e.target.classList.remove('hovered');
        }
    }

    dragDrop(e) {
        e.preventDefault();
        if (e.target.classList.contains('empty')) {
            e.target.classList.remove('hovered');
            e.target.appendChild(this.dragging);
            this.dragging = null;
        }
    }

    checkAnswers() {
        const emptyBox = this.shadowRoot.querySelector('.empty');
        const draggableContents = emptyBox.querySelectorAll('.draggable-content');
        const feedbackContainer = this.shadowRoot.querySelector('.feedback-container');
        feedbackContainer.innerHTML = ''; // Clear previous feedback

        let allCorrect = true;

        draggableContents.forEach(content => {
            const key = content.getAttribute('data-key');
            const item = this.items[key];
            if (item && item.correct) {
                content.style.backgroundColor = 'green'; // Correct items glow green
                // Display correct feedback
                const feedback = document.createElement('p');
                feedback.textContent = item.feedback;
                feedback.style.color = 'green'; // Set text color to green for correct feedback
                feedbackContainer.appendChild(feedback);
            } else {
                allCorrect = false;
                content.style.backgroundColor = 'red'; // Incorrect items glow red
                // Display incorrect feedback
                const feedback = document.createElement('p');
                feedback.textContent = item.feedback;
                feedback.style.color = 'red'; // Set text color to red for incorrect feedback
                feedbackContainer.appendChild(feedback);
            }
        });

        // If all answers are correct, trigger makeItRain and show alert
        if (allCorrect) {
            this.makeItRain();
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    reset() {
        const emptyBox = this.shadowRoot.querySelector('.empty');
        const draggableContents = Array.from(emptyBox.querySelectorAll('.draggable-content'));
    
        // Shuffle the draggable contents array
        const shuffledContents = this.shuffleArray(draggableContents);
    
        // Clear feedback
        const feedbackContainer = this.shadowRoot.querySelector('.feedback-container');
        feedbackContainer.innerHTML = '';
    
        // Reset background color and append shuffled contents to draggable container
        shuffledContents.forEach(content => {
            content.style.backgroundColor = '';
            this.shadowRoot.querySelector('.draggable-container').appendChild(content);
        });
    
        // Reset correct notification
        this.showCorrectNotification = false;
    }

    makeItRain() {
        import("@lrnwebcomponents/multiple-choice/lib/confetti-container.js").then(
          (module) => {
            setTimeout(() => {
              this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
            }, 0);
          }
        );
      }
}

globalThis.customElements.define(TaggingQuestion.tag, TaggingQuestion);



