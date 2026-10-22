export let Display = {
    // DOM elements
    DISPLAY: document.getElementById("display_wrapper"),
    DISPLAY_ELEMENT: document.getElementById("display"),
    SHORTCUT: document.getElementById("btn_open"),
    FULLSCREEN_TOGGLE: document.getElementById("fullscreen_toggle"),
    COMMAND_LINE: document.querySelector("#display .command-line"),
    TASK_BUTTONS: document.querySelectorAll("#display_wrapper .task"),
    TASK_LIST: document.querySelectorAll("#display_wrapper .content-unit"),
    DISPLAY_NAME: document.querySelector("#display_wrapper .process-name"),
    VEIL_ELEMENT: document.querySelector("#display_wrapper .veil"),
    // Constants
    TASK_PROPERTIES: [
        {name: "browser", display: "grid"},
        {name: "console", display: "block"},
        {name: "skills manager", display: "grid"}
    ],
    // States
    mode: "static",
    is_collapsed: false,
    old_X: 0,
    old_Y: 0,
    is_dragging: false,
    currentTask: 0,
    // Animations
    TASK_ANIMATION: [
        {
            display: "block",
            width: "40px",
            height: "40px",
            top: "calc(100% + 5px)",
            left: "calc(50% - 20px)",
            opacity: "0"
        },
        {
            display: "none",
            width: "calc(100% - 10px)",
            height: "calc(100% - 10px)",
            top: "5px",
            left: "5px",
            opacity: "0.8"
        }
    ],
    // Timings
    TASK_TIMINGS: {
        duration: 200,
        iterations: 1
    },

    // Toggling fullscreen (for phones)
    toggle_fullscreen_element () {
        if (!document.fullscreenElement) {
            this.FULLSCREEN_TOGGLE.style.display = "flex";
            this.DISPLAY_ELEMENT.style.filter = "blur(4px)";
        } else {
            this.FULLSCREEN_TOGGLE.style.display = "none";
            this.DISPLAY_ELEMENT.style.filter = "unset";
        }
    },

    // Collapsing display
    toggle_collapse () {
        this.is_collapsed = !this.is_collapsed;
        if (this.DISPLAY_ELEMENT.clientHeight == 510) {
            this.DISPLAY_ELEMENT.style.height = "21px";
        } else {
            this.DISPLAY_ELEMENT.style.height = "510px";
        }
    },

    // Toggle window mode
    change_mode () {
        if (this.mode == "window") {
            this.DISPLAY.style.position = "relative";
            this.DISPLAY.style.top = "0";
            this.DISPLAY.style.left = "0";
            this.COMMAND_LINE.style.cursor = "default";
            this.mode = "static";
        } else {
            this.DISPLAY.style.position = "fixed";
            this.DISPLAY.style.top = "10px";
            this.DISPLAY.style.left = "10px";
            this.COMMAND_LINE.style.cursor = "move";
            this.mode = "window";
        }
    },

    // Start dragging
    drag_start (mouseX, mouseY) {
        this.old_X = mouseX;
        this.old_Y = mouseY;
        this.is_dragging = true;
    },

    // Dragging window
    drag_process (mouseX, mouseY) {
        if (!this.is_dragging || this.mode != "window") return;
        // Horizontal changes
        let new_left = parseInt(this.DISPLAY.style.left) + (mouseX - this.old_X);
        let right_boundary = window.innerWidth - this.COMMAND_LINE.getBoundingClientRect().width;
        if (new_left >= 0 && new_left <= right_boundary) {
            this.DISPLAY.style.left = new_left + "px";
            this.old_X = mouseX;
        }
        // Vertical changes
        let new_top = parseInt(this.DISPLAY.style.top) + (mouseY - this.old_Y);
        let down_boundary = window.innerHeight - this.COMMAND_LINE.getBoundingClientRect().height;
        if (new_top >= 0 && new_top <= down_boundary) {
            this.DISPLAY.style.top = new_top + "px";
            this.old_Y = mouseY;
        }
    },

    // Ending draging
    drag_end () {
        this.is_dragging = false;
    },

    // Closing window
    close () {
        // Restore collapsing
        if (this.is_collapsed) this.toggle_collapse();
        // Animations
        this.DISPLAY.style.overflow = "visible";
        this.DISPLAY.animate([{opacity: 1, left: "5px", bottom: "5px"}, {opacity: 0}], 100)
        .onfinish = () => {
            this.DISPLAY.style.display = "none";
            this.SHORTCUT.style.display = "block";
            this.DISPLAY.style.overflow = "hidden";
            if (this.mode == "window") this.change_mode();
        }
        this.DISPLAY.animate(
            [{display: "block"}, {display: "none"}],
            {duration: 100, pseudoElement: "::before"}
        )
    },

    // Opening window
    open () {
        this.DISPLAY.style.display = "block";
        this.DISPLAY.animate(
            [
                {opacity: 0, transform: "scale(0.1)"},
                {opacity: 1, transform: "scale(1)"}
            ], 50
        );
        this.SHORTCUT.style.display = "none";
    },

    // Creating animation
    create_animation () {
        // Creating animation
        const REVEAL_ANIMATION = this.VEIL_ELEMENT.animate(this.TASK_ANIMATION, this.TASK_TIMINGS);
        REVEAL_ANIMATION.addEventListener('finish', event => { this.swap_task(this.currentTask) });
        this.TASK_BUTTONS.forEach((button) => {
            button.addEventListener('click', (event) => {
                let new_task = event.currentTarget.getAttribute('taskindex');
                if (new_task == this.currentTask) return;
                this.currentTask = new_task;
                REVEAL_ANIMATION.play();
            });
        });
    },

    // Changing task
    swap_task (task_number) {
        this.DISPLAY_NAME.textContent = this.TASK_PROPERTIES[this.currentTask]["name"];
        for (let i = 0; i < 3; i++) {
            const button = this.TASK_BUTTONS[i];
            const task = this.TASK_LIST[i];
            if (i == task_number) {
                button.classList.add('selected');
                task.style.display = this.TASK_PROPERTIES[i]["display"];
            } else {
                button.classList.remove('selected');
                task.style.display = "none";
            }
        }
    }
}