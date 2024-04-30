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
            <div class="tag-question">
                <div class="header">
                    <h2>Tagging</h2>
                </div>
                <img class="image" src=${this.imageUrl} alt="Image"/>
                <div class="text">
                    <p>${this.message}</p>
                </div>

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

                <div class="empty-boxes" @dragover=${this.dragOver} @dragenter=${this.dragEnter} @dragleave=${this.dragLeave} @drop=${this.dragDrop}>
                    <div class="empty"></div>
                </div>

                <div class="controls">
                    <button class="check" @click="${this.checkAnswers}">Check</button>
                    <button class="reset" @click="${this.reset}">Reset</button>
                </div>
            </div>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .description {
                color: white;
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
                background-color: green;
                color: white; 
                padding: 10px 20px;
                border-radius: 5px; 
                cursor: pointer; 
            }

            .reset {
                background-color: red;
                color: white; 
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
                color: green;
                font-size: 250%;
                text-align: center;
            }

            .tag-question {
                background: black;
            }

            .draggable-container {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 20px;
                justify-content: center; 
            }

            .draggable-content {
                background-color: white;
                cursor: pointer;
                margin: 5px;
                flex: 0 0 auto; 
                display: inline-block; 
                padding: 5px 10px; 
                border-radius: 5px; 
                white-space: nowrap; 
            }

            .draggable-content:hover {
                outline: 2px solid blue;
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
                border: solid 3px salmon;
                background: grey;
            }

            .hovered {
                background: #f4f4f4;
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
        
        draggableContents.forEach(content => {
            const key = content.getAttribute('data-key');
            const item = this.items[key];
            if (item && item.correct) {
                content.style.backgroundColor = 'green'; // Correct items glow green
            } else {
                content.style.backgroundColor = 'red'; // Incorrect items glow red
            }
        });
    }

    reset() {
        const emptyBox = this.shadowRoot.querySelector('.empty');
        const draggableContents = emptyBox.querySelectorAll('.draggable-content');
        
        draggableContents.forEach(content => {
            content.style.backgroundColor = ''; // Reset background color
            this.shadowRoot.querySelector('.draggable-container').appendChild(content); // Return items to draggable container
        });
    }
}

globalThis.customElements.define(TaggingQuestion.tag, TaggingQuestion);



