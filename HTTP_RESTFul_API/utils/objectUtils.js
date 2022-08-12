module.exports = {
    hasProperty(object, property) {
        return object.hasOwnProperty(property);
    },
    doesNotHaveProperty(object, property) {
        return !this.hasProperty(object, property);
    }
}