export default class EventLocation {
    constructor(id, idLocation, name, fullAddress, maxCapacity, latitude, longitude, idCreatorUser) {
        this.id = id;
        this.idLocation = idLocation;
        this.name = name;
        this.fullAddress = fullAddress;
        this.maxCapacity = maxCapacity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.idCreatorUser = idCreatorUser;
    }
}
