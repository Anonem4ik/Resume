import pages_content from "../data/browser_site.json" with { type: "json" };

export const Browser = {
    // DOM Elements
    BROWSER: document.getElementById('browser'),
    ADDRESS_LINE: document.querySelector('#browser .address'),
    PAGE: document.querySelector('#browser .content'),

    // Change url
    rediret_to(link) {
        // Finding appropriate content
        const content = pages_content[link] ?? pages_content["404"];
        // Changing content
        this.ADDRESS_LINE.textContent = "https://my-skills.net/" + link;
        this.PAGE.innerHTML = content;
    }
}