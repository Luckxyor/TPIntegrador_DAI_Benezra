// Clase simple para representar un evento
export default class Event {
    constructor(id, name, description, startDate, duration, price, enabled, capacity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.duration = duration;
        this.price = price;
        this.enabled = enabled;
        this.capacity = capacity;
    }
}
