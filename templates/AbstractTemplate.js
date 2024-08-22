class AbstractTemplate {
  constructor(containerElemId) {
    this.container = document.getElementById(containerElemId);
    this.shadowRoot = this.container.attachShadow({ mode: "open" });
    this.rendered = false;
  }

  async render() {
    const response = await fetch(this.contentUri);
    const templateContent = await response.text();
    this.shadowRoot.innerHTML = templateContent;
    this.rendered = true;
  }

  setField(field, data) {
    this.rootElem.find(`#${field} .data`).text(data);
  }
}
