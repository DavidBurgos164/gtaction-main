module.exports = (sequelize, DataTypes) => {
    const skills = sequelize.define("skills", {
        quimico: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        expquimico: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lenador: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        explenador: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        hacker: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        exphacker: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        minero: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        expminero: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        malandro: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        expmalandro: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        expertocoches: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        expexpertocoches: {
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    })

    return skills;
}