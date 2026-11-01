// Imports
import { Display } from "./classes/Display.js";
import { Browser } from "./classes/Browser.js";
import { Manager } from "./classes/Manager.js";
import { Slider } from "./classes/Slider.js";

// Function to get window size
const get_window_width = () => { return Math.min(window.innerWidth, window.screen?.width); }

// Function to test if browser support oreintation locking
async function hasOreintationSupport() {
    let is_supported = await window.screen.orientation.lock('portrait-primary')
    .then(() => { return true })
    .catch((err) => { return err.code != DOMException.NOT_SUPPORTED_ERR });
    return is_supported;
}

// Adapting display to screen size
function resize_display(reset) {
    // Determening window zize
    let window_size = get_window_width();
    // Resizing
    if (window_size >= 1200 || reset) {
        Display.DISPLAY_ELEMENT.style.zoom = 1;
    } else {
        Display.DISPLAY_ELEMENT.style.zoom = (window_size / 1200);
    }
}
window.addEventListener('DOMContentLoaded', event => { resize_display() });
window.addEventListener('resize', event => { resize_display() });

// Command line buttons
const BTN_COLLAPSE = document.querySelector("#btn_collapse");
const BTN_WINDOW_MODE = document.querySelector("#btn_window_mode");
const BTN_CLOSE = document.querySelector("#btn_close");
hasOreintationSupport().then((is_supported) => {
    // Assigning events to buttons on devices with low screen width
    if (get_window_width() <= 700 && is_supported) {
        // Adding new fullscreen element
        Display.toggle_fullscreen_element();
        Display.FULLSCREEN_TOGGLE.addEventListener('click', event => {
            Display.DISPLAY.requestFullscreen();
        });
        // Assigning click events
        [BTN_COLLAPSE, BTN_WINDOW_MODE, BTN_CLOSE].forEach( button => {
            button.addEventListener('click', event => { document.exitFullscreen() });
        });
        // Handling fullscreen
        document.onfullscreenchange = (event) => {
            Display.toggle_fullscreen_element();
            Display.DISPLAY.classList.toggle('fullscreen');
            if (document.fullscreenElement) {
                window.screen.orientation.lock('landscape-primary')
                .then( () => resize_display() );
            } else {
                window.screen.orientation.unlock()
                .then( () => resize_display() );
            }
        }
    // Displaying simple skills list if oreintation is not supported
    } else if (get_window_width() <= 700) {
        const SIMPLE_SKILLS_LIST = document.getElementById('skills_list_simple');
        SIMPLE_SKILLS_LIST.style.display = 'block';
        Display.DISPLAY.style.display = 'none';
    // Assigning events to buttons on normal screens
    } else {
        BTN_COLLAPSE.addEventListener('click', () => { Display.toggle_collapse() });
        BTN_WINDOW_MODE.addEventListener('click', () => { Display.change_mode() });
        BTN_CLOSE.addEventListener('click', () => { Display.close() });
        // Shortcut button
        Display.SHORTCUT.addEventListener('click', () => { Display.open() });
        // Dragging events: start
        Display.COMMAND_LINE.addEventListener('mousedown', (event) => {
            event.preventDefault();
            Display.drag_start(event.clientX, event.clientY);
        });
        Display.COMMAND_LINE.addEventListener('touchstart', (event) => {
            document.body.style.overflow = "hidden";
            Display.drag_start(event.touches[0].clientX, event.touches[0].clientY);
        });
        // Dragging events: drag
        window.addEventListener('mousemove', (event) => {
            event.preventDefault();
            requestAnimationFrame(() => { Display.drag_process(event.clientX, event.clientY) });
        });
        window.addEventListener('touchmove', (event) => {
            requestAnimationFrame(() => { Display.drag_process(event.touches[0].clientX, event.touches[0].clientY) });
        });
        // Dragging events: end
        window.addEventListener('mouseup', () => { Display.drag_end(); });
        window.addEventListener('touchend', () => {
            document.body.style.overflow = "auto";
            Display.drag_end();
        });
    }
})

// Animation initialization
Display.create_animation();

// Initializing browser
Browser.rediret_to("");
// Assigning events to pseudo links
Browser.BROWSER.querySelectorAll(".pseudo-link").forEach(button => {
    const address = button.getAttribute("address");
    button.addEventListener("click", event => {
        button.style.color = "purple";
        Browser.rediret_to(address);
    });
})

// Initializing skills manager
Manager.change_object("git");
// Assigning event to objects buttons
Manager.MANAGER.querySelectorAll(".object").forEach(button => {
    const obj_name = button.textContent;
    button.addEventListener("click", event => {
        Manager.change_object(obj_name);
    })
});

// Creating slider
document.getElementById("control_left").addEventListener('click', event => { Slider.slide(-1) });
document.getElementById("control_right").addEventListener('click', event => { Slider.slide(1) });

// Pausing video on modal close
const video = document.getElementById('preview');
document.getElementById('videoplayer').onclose = (event) => {
    video.pause();
}