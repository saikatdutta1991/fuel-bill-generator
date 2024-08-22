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
      console.log(`Rendering data ${field} with ${value}`);
      this.setField(field, value);
    });
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