import mongoose from 'mongoose';
import config from '../config/config.js';

const tokenSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true
		},
		token: {
			type: String,
			required: true,
			index: true
		},
		type: {
			type: String,
			enum: [config.TOKEN_TYPES.REFRESH, config.TOKEN_TYPES.RESET_PASSWORD, config.TOKEN_TYPES.VERIFY_EMAIL],
			required: true
		},
		blacklisted: {
			type: Boolean,
			default: false
		},
		expiresAt: {
			type: Date,
			required: true
		}
	},
	{
		timestamps: true
	}
);

const Token = mongoose.model('tokens', tokenSchema);

export default Token;