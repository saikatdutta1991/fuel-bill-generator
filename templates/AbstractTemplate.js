class AbstractTemplate {
  constructor(containerElemId) {
    this.containerElemId = containerElemId;
    this.rendered = false;
  }

  async render() {
    const response = await fetch(this.contentUri);
    const templateContent = await response.text();

    const shadowRootOuter = document.createElement("span");
    this.shadowRoot = shadowRootOuter.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = templateContent;
    this.rootElem = $(this.shadowRoot);

    this.container = document.getElementById(this.containerElemId);
    this.container.innerHTML = "";
    this.container.appendChild(shadowRootOuter);

    this.rendered = true;
  }
}
