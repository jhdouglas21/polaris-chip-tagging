import { LitElement, html, css } from 'lit';

export class TaggingCard extends LitElement {

    static get tag() {
        return 'tagging-card';
    }

    constructor() {
        super();
        this.dragging = null;
        this.message = "";
    }

    static get properties() {
        return {
            message: { type: String },
        }
    }

    render() {
        return html`
            <div class="tag-card">
                <div class="header">
                    <h2>Tagging</h2>
                </div>
                <img class="image" src="https://hax.psu.edu/7d3549e0.png" alt="Image" />
                <div class="text">
                    <p>${this.message}</p>
                </div>
                <div class="draggable-container">
                    <div class="draggable-content" draggable="true" @dragstart=${this.dragStart} @dragend=${this.dragEnd}>text</div>
                    <div class="draggable-content" draggable="true" @dragstart=${this.dragStart} @dragend=${this.dragEnd}></div>
                    <div class="draggable-content" draggable="true" @dragstart=${this.dragStart} @dragend=${this.dragEnd}></div>
                    <div class="draggable-content" draggable="true" @dragstart=${this.dragStart} @dragend=${this.dragEnd}></div>
                    <div class="draggable-content" draggable="true" @dragstart=${this.dragStart} @dragend=${this.dragEnd}></div>
                </div>

                <div class="empty-boxes">
                    <div class="empty" @dragover=${this.dragOver} @dragenter=${this.dragEnter} @dragleave=${this.dragLeave} @drop=${this.dragDrop}></div>
                </div>

                <div class="controls">
                    <button class="submit" >Submit</button>
                </div>
            </div>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: block;
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

            .submit {
                background-color: green;
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

            .tag-card {
                background: black;
            }

            .draggable-container {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 20px;
                justify-content: center; /* Align boxes from left to right */
            }

            .draggable-content {
                background-color: white;
                height: 40px;
                width: 60px;
                cursor: pointer;
                margin: 5px;
                flex: 0 0 auto; /* Allow boxes to shrink and not grow */
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
}

globalThis.customElements.define(TaggingCard.tag, TaggingCard);



