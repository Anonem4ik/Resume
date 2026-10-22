export const Slider = {
    // DOM elements
    RAIL: document.querySelector("#projects .rail"),
    BUTTON_LEFT: document.getElementById("control_left"),
    BUTTON_RIGHT: document.getElementById("control_right"),
    // Slider state
    MAX_SLIDES: 2,
    current_slide: 0,

    // Changing function
    slide(step) {
        // Boundary check
        if (this.current_slide + step < 0) return;
        if (this.current_slide + step >= this.MAX_SLIDES) return;
        // Moving
        this.current_slide += step;
        const new_value = `translateX(calc(-${this.current_slide * 100}% - ${this.current_slide * 25}px))`;
        this.RAIL.style.transform = new_value;
        // Changing left button state
        if (this.current_slide <= 0) this.BUTTON_LEFT.disabled = true;
        else this.BUTTON_LEFT.disabled = false;
        // Changing right button state
        if (this.current_slide >= this.MAX_SLIDES - 1) this.BUTTON_RIGHT.disabled = true;
        else this.BUTTON_RIGHT.disabled = false;
    }
}