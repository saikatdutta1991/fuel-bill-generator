class Template1 extends AbstractTemplate {
  constructor(containerElemId) {
    super(containerElemId);
    this.contentUri = "/templates/template-1/content.html";
    this.rootElem = $(this.shadowRoot);
  }

  renderData(data) {
    if (!this.rendered) {
      console.log("Render the Template first");
      return;
    }

    // Render data
    const fields = this.getFields();
    fields.forEach((field) => {
      const value = data[field] || "";
      this.rootElem.find(`#${field} .data`).text(value);
    });

    if (data["pumpLogo"]) {
      this.rootElem.find(`#pumpLogo`).attr("src", data["pumpLogo"]);
    }
  }

  getFields() {
    return [
      "address",
      "receiptNo",
      "localId",
      "fipNo",
      "nozzelNo",
      "product",
      "presetType",
      "rate",
      "volume",
      "amount",
      "atot",
      "vtot",
      "vehicleNo",
      "mobileNo",
      "date",
      "time",
      "cstNo",
      "lstNo",
      "vatNo",
      "attendantId",
      "fccDate",
      "fccTime",
    ];
  }
}
