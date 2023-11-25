document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector(".sidebar")
    const closeBtn = document.querySelector("#btn")
    const searchBtn = document.querySelector(".fi-br-search")

    closeBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open")
        menuBtnChange()
    })

    searchBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open")
        menuBtnChange()
    })

    function menuBtnChange() {
        if (sidebar.classList.contains("open")) {
            closeBtn.classList.replace("fi-br-menu-burger", "fi-br-bars-sort");
        } else {
            closeBtn.classList.replace("fi-br-bars-sort", "fi-br-menu-burger");
        }
    }
})