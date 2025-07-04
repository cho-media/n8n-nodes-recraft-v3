import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IRequestOptions,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

export async function recraftApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	resource: string,
	body: any = {},
	qs: IDataObject = {},
	option: IDataObject = {},
	files?: IDataObject,
): Promise<any> {
	const credentials = await this.getCredentials('recraftApi');

	if (!credentials?.apiToken) {
		throw new NodeOperationError(this.getNode(), 'No API token found. Please configure your Recraft API credentials.');
	}

	let options: IRequestOptions = {
		method,
		qs,
		body,
		url: `https://external.api.recraft.ai/v1${resource}`,
		headers: {
			Authorization: `Bearer ${credentials.apiToken}`,
		},
		json: true,
		timeout: 60000, // 60 second timeout for large image operations
	};

	// Handle file uploads (multipart/form-data)
	if (files && Object.keys(files).length > 0) {
		// Use formData for multipart uploads
		options.formData = {
			...body,
			...files,
		};
		// Remove conflicting options
		delete options.body;
		delete options.json;
		// Let the request library handle Content-Type with boundary
		if (options.headers && 'Content-Type' in options.headers) {
			delete options.headers['Content-Type'];
		}
	}

	// Merge any additional options
	options = Object.assign({}, options, option);

	try {
		const response = await this.helpers.request(options);
		
		// Handle full response objects
		if (options.resolveWithFullResponse === true) {
			return response.body || response;
		}
		
		return response;
	} catch (error: any) {
		// Enhanced error handling
		if (error.response?.body) {
			const errorBody = error.response.body;
			let errorMessage = 'Recraft API Error';
			
			if (typeof errorBody === 'string') {
				errorMessage = errorBody;
			} else if (errorBody.error) {
				errorMessage = typeof errorBody.error === 'string' 
					? errorBody.error 
					: errorBody.error.message || 'Unknown API error';
			} else if (errorBody.message) {
				errorMessage = errorBody.message;
			}

			throw new NodeApiError(this.getNode(), error, {
				message: errorMessage,
				description: `Recraft API returned an error: ${errorMessage}`,
				httpCode: error.response.statusCode?.toString(),
			});
		}

		// Handle network and other errors
		if (error.code === 'ECONNREFUSED') {
			throw new NodeApiError(this.getNode(), error, {
				message: 'Could not connect to Recraft API',
				description: 'Please check your internet connection and try again.',
			});
		}

		if (error.code === 'ETIMEDOUT') {
			throw new NodeApiError(this.getNode(), error, {
				message: 'Request to Recraft API timed out',
				description: 'The request took too long to complete. Please try again.',
			});
		}
		
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function validateBinaryData(
	this: IExecuteFunctions,
	itemIndex: number,
	propertyName: string,
): Promise<{ data: string; fileName?: string; mimeType?: string }> {
	try {
		const binaryData = this.helpers.assertBinaryData(itemIndex, propertyName);
		
		// Validate file size (5MB limit for Recraft API)
		const maxSize = 5 * 1024 * 1024; // 5MB in bytes
		const fileSize = Buffer.byteLength(binaryData.data, 'base64');
		
		if (fileSize > maxSize) {
			throw new NodeOperationError(
				this.getNode(),
				`File size (${Math.round(fileSize / 1024 / 1024)}MB) exceeds the 5MB limit.`,
			);
		}

		// Validate file type
		const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
		if (binaryData.mimeType && !allowedMimeTypes.includes(binaryData.mimeType)) {
			throw new NodeOperationError(
				this.getNode(),
				`Unsupported file type: ${binaryData.mimeType}. Supported types: PNG, JPEG, WEBP.`,
			);
		}

		return binaryData;
	} catch (error: any) {
		if (error.message?.includes('no binary data exists')) {
			throw new NodeOperationError(
				this.getNode(),
				`No binary data found in property "${propertyName}". Please ensure you've connected a node that provides binary data.`,
			);
		}
		throw error;
	}
}
