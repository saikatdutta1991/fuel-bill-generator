class AbstractTemplate {
  constructor(containerElemId) {
    this.container = document.getElementById(containerElemId);
    this.shadowRoot = this.container.attachShadow({ mode: "open" });
  }

  async render() {
    const response = await fetch(this.contentUri);
    const templateContent = await response.text();
    this.shadowRoot.innerHTML = templateContent;
  }
}
