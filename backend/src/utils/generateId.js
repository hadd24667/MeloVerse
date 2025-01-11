// utils/generateId.js

const generateNewId = async (Model, prefix) => {
    const lastUser = await Model.findOne({
        order: [['createdAt', 'DESC']],
    });
    let newId;
    if (lastUser) {
        const lastIdNumber = parseInt(lastUser.id.replace(prefix, ''), 10);
        if (!isNaN(lastIdNumber)) {
            newId = `${prefix}${String(lastIdNumber + 1).padStart(4, '0')}`;
        } else {
            // Handle unexpected ID format case
            newId = `${prefix}0001`;
        }
    } else {
        newId = `${prefix}0001`;
    }
    return newId;
};

module.exports = {
    generateNewId,
};
