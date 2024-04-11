import { LitElement, html, css } from 'lit';

export class TaggingCard extends LitElement {

    static get tag() {
        return 'tagging-card';
    }

    constructor() {
        super();
        this.dragging = null;
    }

    render() {
        return html`
            <div class="empty" @dragover=${this.dragOver} @dragenter=${this.dragEnter} @dragleave=${this.dragLeave} @drop=${this.dragDrop}>
                <div class="fill" draggable="true" @dragstart=${this.dragStart} @dragend=${this.dragEnd}></div>
            </div>

            <div class="empty" @dragover=${this.dragOver} @dragenter=${this.dragEnter} @dragleave=${this.dragLeave} @drop=${this.dragDrop}>
                <div class="fill" draggable="true" @dragstart=${this.dragStart} @dragend=${this.dragEnd}></div>
            </div>

            <div class="empty" @dragover=${this.dragOver} @dragenter=${this.dragEnter} @dragleave=${this.dragLeave} @drop=${this.dragDrop}></div>

            <div class="empty" @dragover=${this.dragOver} @dragenter=${this.dragEnter} @dragleave=${this.dragLeave} @drop=${this.dragDrop}></div>

            <div class="empty" @dragover=${this.dragOver} @dragenter=${this.dragEnter} @dragleave=${this.dragLeave} @drop=${this.dragDrop}></div>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .fill {
                background-image: url('https://source.unsplash.com/random/150x150');
                position: relative;
                height: 150px;
                width: 150px;
                top: 5px;
                left: 5px;
                cursor: pointer;
            }
            .fill:hover {
                outline: 2px solid blue;
            }

            .hold {
                border: solid 5px #ccc;
            }

            .empty {
                display: inline-block;
                height: 160px;
                width: 160px;
                margin: 10px;
                border: solid 3px salmon;
                background: white;
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

