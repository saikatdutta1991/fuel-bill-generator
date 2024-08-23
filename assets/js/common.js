function generate(template) {
  const data = getDataValues("#section-4");
  const pumpLogo = getRadioValue("#section-2", "pumpLogo");
  data["pumpLogo"] = pumpLogo;

  data["showGST"] = isChecked("#section-3", "showGST", "true");
  data["showLST"] = isChecked("#section-3", "showLST", "true");
  data["showVAT"] = isChecked("#section-3", "showVAT", "true");
  data["showCST"] = isChecked("#section-3", "showCST", "true");

  template.renderData(data);
}

function addInputFieldElements(element, fields) {
  const elem = $(element);
  elem.html("");
  fields.forEach((field) => {
    elem.append(`
      <div class="form-group col-md-4">
        <label for="${field.id}">${field.name}</label>
        <input type="text" class="form-control" name="${field.id}" />
      </div>
      `);
  });
}

function loadDefaultData(element, fields) {
  const elem = $(element);
  fields.forEach((field) => {
    elem.find(`input[name=${field.id}]`).val(field.value);
  });
}

function getRadioValue(element, inputName) {
  return $(element).find(`input[name="${inputName}"]:checked`).val();
}

function isChecked(element, inputName, compareStr) {
  return (
    $(element).find(`input[name="${inputName}"]:checked`).val() == compareStr
  );
}

function getDataValues(element) {
  const data = [];
  $(element)
    .find("input")
    .each(function () {
      var name = $(this).attr("name");
      var value = $(this).val();
      data[name] = value;
    });
  return data;
}

// function fitContentToContainer() {
//   const parent = document.getElementById("parent-container");
//   const content = document.getElementById("content");

//   // Get the dimensions of the parent container and the content
//   const parentWidth = parent.clientWidth;
//   const parentHeight = parent.clientHeight;
//   const contentWidth = content.scrollWidth;
//   const contentHeight = content.scrollHeight;

//   // Calculate the scale factors for both width and height
//   const scaleX = parentWidth / contentWidth;
//   const scaleY = parentHeight / contentHeight;

//   // Use the smaller of the two scale factors to ensure the content fits within the container
//   const zoomLevel = Math.min(scaleX, scaleY);

//   // Apply the zoom level to the content
//   content.style.zoom = zoomLevel;
// }
