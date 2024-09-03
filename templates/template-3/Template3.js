class Template3 extends AbstractTemplate {
  constructor(containerElemId) {
    super(containerElemId);
    this.contentUri = "templates/template-3/content.html";
  }

  renderData(data) {
    //   if (!this.rendered) {
    //     throw Error("Render the Template first");
    //   }
    //   console.log(data);
    //   // Render data
    //   const fieldList = this.getConfig().fieldList || [];
    //   if (fieldList.length > 0) {
    //     fieldList.forEach((field) => {
    //       const value = data[field.id] || "";
    //       console.log({ id: field.id, value });
    //       this.rootElem.find(`#${field.id} .data`).text(value);
    //     });
    //   }
    //   const paperTextureList = this.getConfig().paperTextureList || [];
    //   if (paperTextureList.length > 0) {
    //     paperTextureList.forEach((field) => {
    //       const value = data[field.id] || "";
    //       if (value) {
    //         this.rootElem
    //           .find(`.template-container`)
    //           .css("background-image", `url('${value}')`);
    //       }
    //     });
    //   }

    const pumpLogoList = this.getConfig().pumpLogoList || [];
    if (pumpLogoList.length > 0) {
      pumpLogoList.forEach((field) => {
        const value = data[field.id] || "";
        if (value) {
          this.rootElem.find(`#pumpLogo`).attr("src", value);
        }
      });
    }
  }

  getConfig() {
    return {
      optionalFieldList: [],
      pumpLogoList: [
        {
          id: "pumpLogo",
          name: "Indian Oil",
          uri: "assets/images/pump-logo-indian-oil.webp",
          default: true,
        },
        {
          id: "pumpLogo",
          name: "Hp Oil",
          uri: "assets/images/pump-logo-hp.webp",
        },
        {
          id: "pumpLogo",
          name: "Bharat Petroleum",
          uri: "assets/images/pump-logo-bharat-petroleum.webp",
        },
      ],
      paperTextureList: [],
      fieldList: [],
    };
  }
}
