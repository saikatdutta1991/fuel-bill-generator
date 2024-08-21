function fitContentToContainer() {
  const parent = document.getElementById("parent-container");
  const content = document.getElementById("content");

  // Get the dimensions of the parent container and the content
  const parentWidth = parent.clientWidth;
  const parentHeight = parent.clientHeight;
  const contentWidth = content.scrollWidth;
  const contentHeight = content.scrollHeight;

  // Calculate the scale factors for both width and height
  const scaleX = parentWidth / contentWidth;
  const scaleY = parentHeight / contentHeight;

  // Use the smaller of the two scale factors to ensure the content fits within the container
  const zoomLevel = Math.min(scaleX, scaleY);

  // Apply the zoom level to the content
  content.style.zoom = zoomLevel;
}
