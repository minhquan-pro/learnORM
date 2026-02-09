const { PrismaClientValidationError } = require("@prisma/client/runtime/client");
const isProduction = require("@/utils/isProduction");
const { prismaCodes, httpCodes } = require("@/config/constants");

const errorHandle = (err, req, res, _) => {
	if (isProduction()) {
		res.error("Server error.");
	}

	if (err instanceof PrismaClientValidationError) {
		return res.error({
			info: error,
			message: String(error),
		});
	}

	if (err?.code === prismaCodes.duplicate) {
		return res.error(
			{
				message: "Duplicate entry",
			},
			httpCodes.conflict,
		);
	}

	res.error(err ?? "Server Error");
};

module.exports = errorHandle;
