import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { recraftApiRequest, validateBinaryData } from './GenericFunctions';

export class RecraftV3 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Recraft v3',
		name: 'recraftV3',
		icon: 'file:recraft.svg',
		group: ['ai'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Generate and edit images using Recraft v3 AI - the #1 ranked text-to-image model',
		defaults: {
			name: 'Recraft v3',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'recraftApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Image',
						value: 'image',
						description: 'Generate and edit images',
					},
					{
						name: 'Style',
						value: 'style',
						description: 'Create custom styles',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Get account information',
					},
				],
				default: 'image',
			},
			// Image Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['image'],
					},
				},
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate image from text prompt',
						action: 'Generate an image',
					},
					{
						name: 'Image to Image',
						value: 'imageToImage',
						description: 'Transform an input image based on prompt',
						action: 'Transform an image',
					},
					{
						name: 'Inpaint',
						value: 'inpaint',
						description: 'Replace specific parts of an image using mask',
						action: 'Inpaint an image',
					},
					{
						name: 'Replace Background',
						value: 'replaceBackground',
						description: 'Replace the background of an image',
						action: 'Replace background',
					},
					{
						name: 'Remove Background',
						value: 'removeBackground',
						description: 'Remove background from an image',
						action: 'Remove background',
					},
					{
						name: 'Vectorize',
						value: 'vectorize',
						description: 'Convert raster image to SVG format',
						action: 'Vectorize an image',
					},
					{
						name: 'Crisp Upscale',
						value: 'crispUpscale',
						description: 'Enhance image resolution with crisp upscaling',
						action: 'Crisp upscale an image',
					},
					{
						name: 'Creative Upscale',
						value: 'creativeUpscale',
						description: 'Enhance image resolution with creative upscaling',
						action: 'Creative upscale an image',
					},
				],
				default: 'generate',
			},
			// Style Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['style'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a custom style from reference images',
						action: 'Create a style',
					},
				],
				default: 'create',
			},
			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get current user information and credits balance',
						action: 'Get user info',
					},
				],
				default: 'getInfo',
			},
			// Generate Image Parameters
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				default: '',
				placeholder: 'A majestic landscape with mountains and a lake at sunset',
				description: 'Text description of the desired image (max 4000 characters for Recraft v3)',
				typeOptions: {
					rows: 3,
				},
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				options: [
					{
						name: 'Recraft V3 (Recommended)',
						value: 'recraftv3',
						description: '#1 ranked model on Hugging Face benchmark',
					},
					{
						name: 'Recraft V2 (20B)',
						value: 'recraft20b',
						description: 'Previous generation model',
					},
				],
				default: 'recraftv3',
				description: 'Model to use for image generation',
			},
			{
				displayName: 'Style',
				name: 'style',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				options: [
					{
						name: 'Realistic Image',
						value: 'realistic_image',
						description: 'Photo-like images',
					},
					{
						name: 'Digital Illustration',
						value: 'digital_illustration',
						description: 'Hand-drawn or computer-generated art',
					},
					{
						name: 'Vector Illustration',
						value: 'vector_illustration',
						description: 'Clean vector graphics',
					},
					{
						name: 'Icon',
						value: 'icon',
						description: 'Simple, recognizable symbols',
					},
				],
				default: 'realistic_image',
				description: 'Style for the generated image',
			},
			{
				displayName: 'Sub Style',
				name: 'substyle',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
						style: ['digital_illustration'],
					},
				},
				options: [
					{
						name: 'None',
						value: '',
					},
					{
						name: 'Hand Drawn',
						value: 'hand_drawn',
					},
					{
						name: 'Pixel Art',
						value: 'pixel_art',
					},
					{
						name: 'Cartoon',
						value: 'cartoon',
					},
					{
						name: 'Anime',
						value: 'anime',
					},
					{
						name: '3D Render',
						value: '3d_render',
					},
				],
				default: '',
				description: 'Sub-style for digital illustrations',
			},
			{
				displayName: 'Image Size',
				name: 'size',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				options: [
					{
						name: '1024x1024 (Square)',
						value: '1024x1024',
					},
					{
						name: '1365x1024 (Landscape)',
						value: '1365x1024',
					},
					{
						name: '1024x1365 (Portrait)',
						value: '1024x1365',
					},
					{
						name: '1536x1024 (Wide)',
						value: '1536x1024',
					},
					{
						name: '1024x1536 (Tall)',
						value: '1024x1536',
					},
					{
						name: '1820x1024 (Ultra Wide)',
						value: '1820x1024',
					},
					{
						name: '1024x1820 (Ultra Tall)',
						value: '1024x1820',
					},
					{
						name: '2048x1024 (Extra Wide)',
						value: '2048x1024',
					},
					{
						name: '1024x2048 (Extra Tall)',
						value: '1024x2048',
					},
					{
						name: '1280x1024 (Standard Wide)',
						value: '1280x1024',
					},
					{
						name: '1024x1280 (Standard Tall)',
						value: '1024x1280',
					},
				],
				default: '1024x1024',
				description: 'Size of the generated image',
			},
			{
				displayName: 'Custom Style ID',
				name: 'styleId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				default: '',
				placeholder: 'style-id-from-create-style-operation',
				description: 'Use a custom style ID instead of predefined styles (overrides style parameter)',
			},
			{
				displayName: 'Response Format',
				name: 'responseFormat',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Return image URL',
					},
					{
						name: 'Base64 JSON',
						value: 'b64_json',
						description: 'Return base64 encoded image data',
					},
				],
				default: 'url',
				description: 'Format of the response',
			},
			// Advanced options for Generate
			{
				displayName: 'Advanced Options',
				name: 'advancedOptions',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				options: [
					{
						displayName: 'Colors',
						name: 'colors',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Specify colors to use in the generated image',
						options: [
							{
								name: 'color',
								displayName: 'Color',
								values: [
									{
										displayName: 'Red (0-255)',
										name: 'r',
										type: 'number',
										default: 255,
										typeOptions: {
											minValue: 0,
											maxValue: 255,
										},
									},
									{
										displayName: 'Green (0-255)',
										name: 'g',
										type: 'number',
										default: 255,
										typeOptions: {
											minValue: 0,
											maxValue: 255,
										},
									},
									{
										displayName: 'Blue (0-255)',
										name: 'b',
										type: 'number',
										default: 255,
										typeOptions: {
											minValue: 0,
											maxValue: 255,
										},
									},
								],
							},
						],
					},
					{
						displayName: 'Text Layout',
						name: 'textLayout',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Define text elements and their positions in the image',
						options: [
							{
								name: 'textElement',
								displayName: 'Text Element',
								values: [
									{
										displayName: 'Text',
										name: 'text',
										type: 'string',
										default: '',
										description: 'Individual word to place in the image',
									},
									{
										displayName: 'Bounding Box (JSON)',
										name: 'bbox',
										type: 'string',
										default: '[[0.3, 0.45], [0.6, 0.45], [0.6, 0.55], [0.3, 0.55]]',
										description: 'Bounding box as JSON array of 4 points [[x1,y1], [x2,y2], [x3,y3], [x4,y4]] with coordinates 0-1',
									},
								],
							},
						],
					},
				],
			},
			// Image to Image Parameters
			{
				displayName: 'Input Image',
				name: 'inputImage',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['imageToImage', 'inpaint', 'replaceBackground', 'removeBackground', 'vectorize', 'crispUpscale', 'creativeUpscale'],
					},
				},
				default: 'data',
				description: 'Name of the binary property containing the image file',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['imageToImage', 'inpaint', 'replaceBackground'],
					},
				},
				default: '',
				placeholder: 'Transform the scene to winter with snow',
				description: 'Text description for the transformation',
				typeOptions: {
					rows: 2,
				},
			},
			{
				displayName: 'Strength',
				name: 'strength',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['imageToImage'],
					},
				},
				default: 0.5,
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberPrecision: 2,
				},
				description: 'How much to change the input image (0 = no change, 1 = complete change)',
			},
			{
				displayName: 'Style',
				name: 'transformStyle',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['imageToImage', 'inpaint', 'replaceBackground'],
					},
				},
				options: [
					{
						name: 'Any',
						value: 'any',
					},
					{
						name: 'Realistic Image',
						value: 'realistic_image',
					},
					{
						name: 'Digital Illustration',
						value: 'digital_illustration',
					},
					{
						name: 'Vector Illustration',
						value: 'vector_illustration',
					},
				],
				default: 'any',
				description: 'Style for the transformation',
			},
			// Inpaint specific
			{
				displayName: 'Mask Image',
				name: 'maskImage',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['inpaint'],
					},
				},
				default: 'mask',
				description: 'Name of the binary property containing the mask file (white = inpaint, black = keep)',
			},
			// Style Creation Parameters
			{
				displayName: 'Base Style',
				name: 'baseStyle',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['style'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Realistic Image',
						value: 'realistic_image',
					},
					{
						name: 'Digital Illustration',
						value: 'digital_illustration',
					},
					{
						name: 'Vector Illustration',
						value: 'vector_illustration',
					},
					{
						name: 'Icon',
						value: 'icon',
					},
				],
				default: 'digital_illustration',
				description: 'Base style for the custom style',
			},
			{
				displayName: 'Reference Images',
				name: 'referenceImages',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['style'],
						operation: ['create'],
					},
				},
				default: 'data',
				description: 'Name of the binary property containing reference images (comma-separated for multiple)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				if (resource === 'image') {
					if (operation === 'generate') {
						const prompt = this.getNodeParameter('prompt', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const style = this.getNodeParameter('style', i) as string;
						const substyle = this.getNodeParameter('substyle', i) as string;
						const size = this.getNodeParameter('size', i) as string;
						const styleId = this.getNodeParameter('styleId', i) as string;
						const responseFormat = this.getNodeParameter('responseFormat', i) as string;
						const advancedOptions = this.getNodeParameter('advancedOptions', i) as IDataObject;

						// Validate prompt length
						if (prompt.length > 4000) {
							throw new NodeOperationError(
								this.getNode(),
								`Prompt is too long (${prompt.length} characters). Maximum allowed is 4000 characters.`,
								{ itemIndex: i }
							);
						}

						const body: IDataObject = {
							prompt,
							model,
							size,
							response_format: responseFormat,
						};

						// Handle style vs style_id
						if (styleId && styleId.trim()) {
							body.style_id = styleId.trim();
						} else {
							body.style = style;
							if (substyle && substyle.trim()) {
								body.substyle = substyle;
							}
						}

						// Handle advanced options
						if (advancedOptions.colors || advancedOptions.textLayout) {
							const controls: IDataObject = {};
							
							if (advancedOptions.colors) {
								const colors = (advancedOptions.colors as IDataObject).color as IDataObject[];
								if (colors && colors.length > 0) {
									controls.colors = colors.map(color => ({
										rgb: [color.r, color.g, color.b]
									}));
								}
							}

							if (advancedOptions.textLayout) {
								const textElements = (advancedOptions.textLayout as IDataObject).textElement as IDataObject[];
								if (textElements && textElements.length > 0) {
									try {
										controls.text_layout = textElements.map(element => ({
											text: element.text,
											bbox: JSON.parse(element.bbox as string)
										}));
									} catch (parseError) {
										throw new NodeOperationError(
											this.getNode(),
											'Invalid JSON format in text layout bounding box. Please ensure it follows the format: [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]',
											{ itemIndex: i }
										);
									}
								}
							}

							if (Object.keys(controls).length > 0) {
								body.controls = controls;
							}
						}

						responseData = await recraftApiRequest.call(this, 'POST', '/images/generations', body);

					} else if (operation === 'imageToImage') {
						const prompt = this.getNodeParameter('prompt', i) as string;
						const strength = this.getNodeParameter('strength', i) as number;
						const transformStyle = this.getNodeParameter('transformStyle', i) as string;
						const inputImage = this.getNodeParameter('inputImage', i) as string;

						const binaryData = await validateBinaryData.call(this, i, inputImage);
						
						const formData = {
							prompt,
							strength: strength.toString(),
							style: transformStyle,
						};

						responseData = await recraftApiRequest.call(this, 'POST', '/images/imageToImage', formData, {}, {}, {
							image: {
								value: Buffer.from(binaryData.data, 'base64'),
								options: {
									filename: binaryData.fileName || 'image.png',
									contentType: binaryData.mimeType || 'image/png',
								},
							},
						});

					} else if (operation === 'inpaint') {
						const prompt = this.getNodeParameter('prompt', i) as string;
						const transformStyle = this.getNodeParameter('transformStyle', i) as string;
						const inputImage = this.getNodeParameter('inputImage', i) as string;
						const maskImage = this.getNodeParameter('maskImage', i) as string;

						const imageBinaryData = await validateBinaryData.call(this, i, inputImage);
						const maskBinaryData = await validateBinaryData.call(this, i, maskImage);
						
						const formData = {
							prompt,
							style: transformStyle,
						};

						responseData = await recraftApiRequest.call(this, 'POST', '/images/inpaint', formData, {}, {}, {
							image: {
								value: Buffer.from(imageBinaryData.data, 'base64'),
								options: {
									filename: imageBinaryData.fileName || 'image.png',
									contentType: imageBinaryData.mimeType || 'image/png',
								},
							},
							mask: {
								value: Buffer.from(maskBinaryData.data, 'base64'),
								options: {
									filename: maskBinaryData.fileName || 'mask.png',
									contentType: maskBinaryData.mimeType || 'image/png',
								},
							},
						});

					} else if (operation === 'replaceBackground') {
						const prompt = this.getNodeParameter('prompt', i) as string;
						const transformStyle = this.getNodeParameter('transformStyle', i) as string;
						const inputImage = this.getNodeParameter('inputImage', i) as string;

						const binaryData = await validateBinaryData.call(this, i, inputImage);
						
						const formData = {
							prompt,
							style: transformStyle,
						};

						responseData = await recraftApiRequest.call(this, 'POST', '/images/replaceBackground', formData, {}, {}, {
							image: {
								value: Buffer.from(binaryData.data, 'base64'),
								options: {
									filename: binaryData.fileName || 'image.png',
									contentType: binaryData.mimeType || 'image/png',
								},
							},
						});

					} else if (['removeBackground', 'vectorize', 'crispUpscale', 'creativeUpscale'].includes(operation)) {
						const inputImage = this.getNodeParameter('inputImage', i) as string;
						const binaryData = await validateBinaryData.call(this, i, inputImage);
						
						const endpoint = `/images/${operation}`;
						
						responseData = await recraftApiRequest.call(this, 'POST', endpoint, {}, {}, {}, {
							file: {
								value: Buffer.from(binaryData.data, 'base64'),
								options: {
									filename: binaryData.fileName || 'image.png',
									contentType: binaryData.mimeType || 'image/png',
								},
							},
						});
					}

				} else if (resource === 'style') {
					if (operation === 'create') {
						const baseStyle = this.getNodeParameter('baseStyle', i) as string;
						const referenceImages = this.getNodeParameter('referenceImages', i) as string;

						const imageNames = referenceImages.split(',').map(name => name.trim()).filter(name => name);
						
						if (imageNames.length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one reference image is required for style creation.',
								{ itemIndex: i }
							);
						}

						const files: IDataObject = {};
						
						for (let j = 0; j < imageNames.length; j++) {
							const binaryData = await validateBinaryData.call(this, i, imageNames[j]);
							files[`file${j + 1}`] = {
								value: Buffer.from(binaryData.data, 'base64'),
								options: {
									filename: binaryData.fileName || `image${j + 1}.png`,
									contentType: binaryData.mimeType || 'image/png',
								},
							};
						}

						const formData = {
							style: baseStyle,
						};

						responseData = await recraftApiRequest.call(this, 'POST', '/styles', formData, {}, {}, files);
					}

				} else if (resource === 'user') {
					if (operation === 'getInfo') {
						responseData = await recraftApiRequest.call(this, 'GET', '/users/me');
					}
				}

				// Add metadata to response
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ 
						itemData: { item: i },
						pairedItem: { item: i },
					},
				);

				returnData.push(...executionData);

			} catch (error: any) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ 
							error: error.message,
							statusCode: error.httpCode || 'Unknown',
							timestamp: new Date().toISOString(),
						}),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return returnData;
	}
}
