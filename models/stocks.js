module.exports = (sequelize, DataTypes) => {
	return sequelize.define('stocks', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		stocks: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};