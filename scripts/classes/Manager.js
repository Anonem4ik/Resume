import M_objects from "../data/manager_initial_data.json" with { type: "json" };

export const Manager = {
    // DOM elements
    MANAGER: document.getElementById('skills_manager'),
    WORKSPACE: document.getElementById('workspace'),
    // Conversion lists
    ICONS: {
        "string": "datatype_string.svg",
        "number": "datatype_number.svg",
        "date": "datatype_date.svg"
    },
    TYPES: {
        "string": "Строка",
        "number": "Число",
        "date": "Дата"
    },

    // Changing elements
    change_object(obj_name) {
        // Clearing elements
        this.WORKSPACE.replaceChildren(this.WORKSPACE.firstElementChild);
        // Displaying new properties
        const properties_list = M_objects[obj_name];
        for (const property of properties_list) {
            const new_row = document.createElement('tr');
            new_row.innerHTML += `<td><img src="./images/${this.ICONS[property['type']]}"></td>`;
            new_row.innerHTML += `<td>${this.TYPES[property['type']]}</td>`;
            new_row.innerHTML += `<td>${property['name']}</td>`;
            new_row.innerHTML += `<td>${property['value']}</td>`;
            this.WORKSPACE.append(new_row);
        }
    }
}