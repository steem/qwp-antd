module.exports = {
    !isRequiredLogin(m) {
        return ['passport'].includes(m);
    },
}
