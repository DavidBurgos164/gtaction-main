module.exports = (sequelize, DataTypes) => {
    const playerClothes = sequelize.define("player_clothes", {
        OwnerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        data: {
            type: DataTypes.STRING('1234'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dataJob: {
            type: DataTypes.STRING('1234'),
            allowNull: true,
            validate: {
                notEmpty: false
            }
        },
    })

    return playerClothes;
}