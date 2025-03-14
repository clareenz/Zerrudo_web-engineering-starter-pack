const switcher = document.getElementById("switcher");
const container = document.querySelector(".container");

switcher.addEventListener("change", (evt) => {
    container.setAttribute("style", `align-content: ${evt.target.value}`);
});
