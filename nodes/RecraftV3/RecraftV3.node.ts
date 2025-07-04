import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
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
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
				description: 'Text description of the desired image (max 1000 bytes)',
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
						value: 'recraftv2',
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
						name: 'Any',
						value: 'any',
						description: 'Let AI choose the best style',
					},
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
					{
						name: 'Logo Raster',
						value: 'logo_raster',
						description: 'Raster logo designs',
					},
				],
				default: 'realistic_image',
				description: 'Style for the generated image',
			},
			// Realistic Image Substyles
			{
				displayName: 'Sub Style',
				name: 'substyle',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
						style: ['realistic_image'],
					},
				},
				options: [
					{
						name: 'None',
						value: '',
					},
					{
						name: 'Black & White',
						value: 'b_and_w',
					},
					{
						name: 'Enterprise',
						value: 'enterprise',
					},
					{
						name: 'Evening Light',
						value: 'evening_light',
					},
					{
						name: 'Faded Nostalgia',
						value: 'faded_nostalgia',
					},
					{
						name: 'Forest Life',
						value: 'forest_life',
					},
					{
						name: 'Hard Flash',
						value: 'hard_flash',
					},
					{
						name: 'HDR',
						value: 'hdr',
					},
					{
						name: 'Motion Blur',
						value: 'motion_blur',
					},
					{
						name: 'Mystic Naturalism',
						value: 'mystic_naturalism',
					},
					{
						name: 'Natural Light',
						value: 'natural_light',
					},
					{
						name: 'Natural Tones',
						value: 'natural_tones',
					},
					{
						name: 'Organic Calm',
						value: 'organic_calm',
					},
					{
						name: 'Real Life Glow',
						value: 'real_life_glow',
					},
					{
						name: 'Retro Realism',
						value: 'retro_realism',
					},
					{
						name: 'Retro Snapshot',
						value: 'retro_snapshot',
					},
					{
						name: 'Studio Portrait',
						value: 'studio_portrait',
					},
					{
						name: 'Urban Drama',
						value: 'urban_drama',
					},
					{
						name: 'Village Realism',
						value: 'village_realism',
					},
					{
						name: 'Warm Folk',
						value: 'warm_folk',
					},
				],
				default: '',
				description: 'Sub-style for realistic images',
			},
			// Digital Illustration Substyles  
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
						name: '2D Art Poster',
						value: '2d_art_poster',
					},
					{
						name: '2D Art Poster 2',
						value: '2d_art_poster_2',
					},
					{
						name: 'Antiquarian',
						value: 'antiquarian',
					},
					{
						name: 'Bold Fantasy',
						value: 'bold_fantasy',
					},
					{
						name: 'Child Book',
						value: 'child_book',
					},
					{
						name: 'Cover',
						value: 'cover',
					},
					{
						name: 'Crosshatch',
						value: 'crosshatch',
					},
					{
						name: 'Digital Engraving',
						value: 'digital_engraving',
					},
					{
						name: 'Engraving Color',
						value: 'engraving_color',
					},
					{
						name: 'Expressionism',
						value: 'expressionism',
					},
					{
						name: 'Freehand Details',
						value: 'freehand_details',
					},
					{
						name: 'Grain',
						value: 'grain',
					},
					{
						name: 'Grain 20',
						value: 'grain_20',
					},
					{
						name: 'Graphic Intensity',
						value: 'graphic_intensity',
					},
					{
						name: 'Hand Drawn',
						value: 'hand_drawn',
					},
					{
						name: 'Hand Drawn Outline',
						value: 'hand_drawn_outline',
					},
					{
						name: 'Handmade 3D',
						value: 'handmade_3d',
					},
					{
						name: 'Hard Comics',
						value: 'hard_comics',
					},
					{
						name: 'Infantile Sketch',
						value: 'infantile_sketch',
					},
					{
						name: 'Long Shadow',
						value: 'long_shadow',
					},
					{
						name: 'Modern Folk',
						value: 'modern_folk',
					},
					{
						name: 'Multicolor',
						value: 'multicolor',
					},
					{
						name: 'Neon Calm',
						value: 'neon_calm',
					},
					{
						name: 'Noir',
						value: 'noir',
					},
					{
						name: 'Nostalgic Pastel',
						value: 'nostalgic_pastel',
					},
					{
						name: 'Outline Details',
						value: 'outline_details',
					},
					{
						name: 'Pastel Gradient',
						value: 'pastel_gradient',
					},
					{
						name: 'Pastel Sketch',
						value: 'pastel_sketch',
					},
					{
						name: 'Pixel Art',
						value: 'pixel_art',
					},
					{
						name: 'Plastic',
						value: 'plastic',
					},
					{
						name: 'Pop Art',
						value: 'pop_art',
					},
					{
						name: 'Pop Renaissance',
						value: 'pop_renaissance',
					},
					{
						name: 'Seamless',
						value: 'seamless',
					},
					{
						name: 'Street Art',
						value: 'street_art',
					},
					{
						name: 'Tablet Sketch',
						value: 'tablet_sketch',
					},
					{
						name: 'Urban Glow',
						value: 'urban_glow',
					},
					{
						name: 'Urban Sketching',
						value: 'urban_sketching',
					},
					{
						name: 'Young Adult Book',
						value: 'young_adult_book',
					},
					{
						name: 'Young Adult Book 2',
						value: 'young_adult_book_2',
					},
				],
				default: '',
				description: 'Sub-style for digital illustrations',
			},
			// Vector Illustration Substyles
			{
				displayName: 'Sub Style',
				name: 'substyle',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
						style: ['vector_illustration'],
					},
				},
				options: [
					{
						name: 'None',
						value: '',
					},
					{
						name: 'Bold Stroke',
						value: 'bold_stroke',
					},
					{
						name: 'Chemistry',
						value: 'chemistry',
					},
					{
						name: 'Colored Stencil',
						value: 'colored_stencil',
					},
					{
						name: 'Cosmics',
						value: 'cosmics',
					},
					{
						name: 'Cutout',
						value: 'cutout',
					},
					{
						name: 'Depressive',
						value: 'depressive',
					},
					{
						name: 'Editorial',
						value: 'editorial',
					},
					{
						name: 'Emotional Flat',
						value: 'emotional_flat',
					},
					{
						name: 'Engraving',
						value: 'engraving',
					},
					{
						name: 'Line Art',
						value: 'line_art',
					},
					{
						name: 'Line Circuit',
						value: 'line_circuit',
					},
					{
						name: 'Linocut',
						value: 'linocut',
					},
					{
						name: 'Marker Outline',
						value: 'marker_outline',
					},
					{
						name: 'Mosaic',
						value: 'mosaic',
					},
					{
						name: 'Naivector',
						value: 'naivector',
					},
					{
						name: 'Roundish Flat',
						value: 'roundish_flat',
					},
					{
						name: 'Seamless',
						value: 'seamless',
					},
					{
						name: 'Segmented Colors',
						value: 'segmented_colors',
					},
					{
						name: 'Sharp Contrast',
						value: 'sharp_contrast',
					},
					{
						name: 'Thin',
						value: 'thin',
					},
					{
						name: 'Vector Photo',
						value: 'vector_photo',
					},
					{
						name: 'Vivid Shapes',
						value: 'vivid_shapes',
					},
				],
				default: '',
				description: 'Sub-style for vector illustrations',
			},
			// Logo Raster Substyles (V3 only)
			{
				displayName: 'Sub Style',
				name: 'substyle',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
						style: ['logo_raster'],
						model: ['recraftv3'],
					},
				},
				options: [
					{
						name: 'None',
						value: '',
					},
					{
						name: 'Emblem Graffiti',
						value: 'emblem_graffiti',
					},
					{
						name: 'Emblem Pop Art',
						value: 'emblem_pop_art',
					},
					{
						name: 'Emblem Punk',
						value: 'emblem_punk',
					},
					{
						name: 'Emblem Stamp',
						value: 'emblem_stamp',
					},
					{
						name: 'Emblem Vintage',
						value: 'emblem_vintage',
					},
				],
				default: '',
				description: 'Sub-style for logo raster (Recraft V3 only)',
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
						name: '1434x1024 (Widescreen)',
						value: '1434x1024',
					},
					{
						name: '1024x1434 (Tall Screen)',
						value: '1024x1434',
					},
					{
						name: '1280x1024 (Standard Wide)',
						value: '1280x1024',
					},
					{
						name: '1024x1280 (Standard Tall)',
						value: '1024x1280',
					},
					{
						name: '1707x1024 (Cinematic)',
						value: '1707x1024',
					},
					{
						name: '1024x1707 (Tall Cinematic)',
						value: '1024x1707',
					},
				],
				default: '1024x1024',
				description: 'Size of the generated image',
			},
			{
				displayName: 'Number of Images',
				name: 'n',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				default: 1,
				typeOptions: {
					minValue: 1,
					maxValue: 6,
				},
				description: 'Number of images to generate (1-6)',
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
				displayName: 'Negative Prompt',
				name: 'negativePrompt',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				default: '',
				placeholder: 'Elements to avoid in the image',
				description: 'Text description of undesired elements in the image',
				typeOptions: {
					rows: 2,
				},
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
			// Advanced options for Generate - COMPLETE CONTROLS
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
						displayName: 'Artistic Level',
						name: 'artisticLevel',
						type: 'number',
						default: 2,
						typeOptions: {
							minValue: 0,
							maxValue: 5,
						},
						description: 'Defines artistic tone (0=simple/static, 5=dynamic/eccentric)',
					},
					{
						displayName: 'Background Color',
						name: 'backgroundColor',
						type: 'collection',
						default: {},
						description: 'Desired background color',
						options: [
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
					{
						displayName: 'No Text',
						name: 'noText',
						type: 'boolean',
						default: false,
						description: 'Do not embed text layouts',
					},
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
						description: 'Define text elements and their positions in the image (Recraft V3 only)',
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
										description: 'Individual word to place in the image (supported characters only)',
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
				description: 'Text description for the transformation (max 1000 bytes)',
				typeOptions: {
					rows: 2,
				},
			},
			{
				displayName: 'Strength',
				name: 'strength',
				type: 'number',
				required: true,
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
				displayName: 'Number of Images',
				name: 'nTransform',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['imageToImage', 'inpaint', 'replaceBackground'],
					},
				},
				default: 1,
				typeOptions: {
					minValue: 1,
					maxValue: 6,
				},
				description: 'Number of images to generate (1-6)',
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
			{
				displayName: 'Negative Prompt',
				name: 'negativePromptTransform',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['imageToImage', 'inpaint', 'replaceBackground'],
					},
				},
				default: '',
				placeholder: 'Elements to avoid in the transformed image',
				description: 'Text description of undesired elements',
			},
			{
				displayName: 'Response Format',
				name: 'responseFormatTransform',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['imageToImage', 'inpaint', 'replaceBackground', 'removeBackground', 'vectorize', 'crispUpscale', 'creativeUpscale'],
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
				description: 'Name of the binary property containing reference images (comma-separated for multiple, max 5 images)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
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
						const n = this.getNodeParameter('n', i) as number;
						const styleId = this.getNodeParameter('styleId', i) as string;
						const negativePrompt = this.getNodeParameter('negativePrompt', i) as string;
						const responseFormat = this.getNodeParameter('responseFormat', i) as string;
						const advancedOptions = this.getNodeParameter('advancedOptions', i) as IDataObject;

						// Validate prompt length (max 1000 bytes)
						if (Buffer.byteLength(prompt, 'utf8') > 1000) {
							throw new NodeOperationError(
								this.getNode(),
								`Prompt is too long (${Buffer.byteLength(prompt, 'utf8')} bytes). Maximum allowed is 1000 bytes.`,
								{ itemIndex: i }
							);
						}

						const body: IDataObject = {
							prompt,
							model,
							size,
							n,
							response_format: responseFormat,
						};

						// Add negative prompt if provided
						if (negativePrompt && negativePrompt.trim()) {
							body.negative_prompt = negativePrompt.trim();
						}

						// Handle style vs style_id
						if (styleId && styleId.trim()) {
							body.style_id = styleId.trim();
						} else {
							body.style = style;
							if (substyle && substyle.trim()) {
								body.substyle = substyle;
							}
						}

						// Handle advanced controls
						const controls: IDataObject = {};
						
						if (advancedOptions.artisticLevel !== undefined) {
							controls.artistic_level = advancedOptions.artisticLevel;
						}

						if (advancedOptions.backgroundColor && typeof advancedOptions.backgroundColor === 'object') {
							const bgColor = advancedOptions.backgroundColor as IDataObject;
							if (bgColor.r !== undefined && bgColor.g !== undefined && bgColor.b !== undefined) {
								controls.background_color = {
									rgb: [bgColor.r, bgColor.g, bgColor.b]
								};
							}
						}

						if (advancedOptions.noText === true) {
							controls.no_text = true;
						}

						if (advancedOptions.colors) {
							const colors = (advancedOptions.colors as IDataObject).color as IDataObject[];
							if (colors && colors.length > 0) {
								controls.colors = colors.map(color => ({
									rgb: [color.r, color.g, color.b]
								}));
							}
						}

						if (advancedOptions.textLayout && model === 'recraftv3') {
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

						responseData = await recraftApiRequest.call(this, 'POST', '/images/generations', body);

					} else if (operation === 'imageToImage') {
						const prompt = this.getNodeParameter('prompt', i) as string;
						const strength = this.getNodeParameter('strength', i) as number;
						const transformStyle = this.getNodeParameter('transformStyle', i) as string;
						const inputImage = this.getNodeParameter('inputImage', i) as string;
						const nTransform = this.getNodeParameter('nTransform', i) as number;
						const negativePromptTransform = this.getNodeParameter('negativePromptTransform', i) as string;
						const responseFormatTransform = this.getNodeParameter('responseFormatTransform', i) as string;

						const binaryData = await validateBinaryData.call(this, i, inputImage);
						
						const formData: IDataObject = {
							prompt,
							strength: strength.toString(),
							style: transformStyle,
							n: nTransform.toString(),
							response_format: responseFormatTransform,
						};

						if (negativePromptTransform && negativePromptTransform.trim()) {
							formData.negative_prompt = negativePromptTransform.trim();
						}

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
						const nTransform = this.getNodeParameter('nTransform', i) as number;
						const negativePromptTransform = this.getNodeParameter('negativePromptTransform', i) as string;
						const responseFormatTransform = this.getNodeParameter('responseFormatTransform', i) as string;

						const imageBinaryData = await validateBinaryData.call(this, i, inputImage);
						const maskBinaryData = await validateBinaryData.call(this, i, maskImage);
						
						const formData: IDataObject = {
							prompt,
							style: transformStyle,
							n: nTransform.toString(),
							response_format: responseFormatTransform,
						};

						if (negativePromptTransform && negativePromptTransform.trim()) {
							formData.negative_prompt = negativePromptTransform.trim();
						}

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
						const nTransform = this.getNodeParameter('nTransform', i) as number;
						const negativePromptTransform = this.getNodeParameter('negativePromptTransform', i) as string;
						const responseFormatTransform = this.getNodeParameter('responseFormatTransform', i) as string;

						const binaryData = await validateBinaryData.call(this, i, inputImage);
						
						const formData: IDataObject = {
							prompt,
							style: transformStyle,
							n: nTransform.toString(),
							response_format: responseFormatTransform,
						};

						if (negativePromptTransform && negativePromptTransform.trim()) {
							formData.negative_prompt = negativePromptTransform.trim();
						}

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
						const responseFormatTransform = this.getNodeParameter('responseFormatTransform', i) as string;
						const binaryData = await validateBinaryData.call(this, i, inputImage);
						
						const endpoint = `/images/${operation}`;
						
						const formData: IDataObject = {
							response_format: responseFormatTransform,
						};

						responseData = await recraftApiRequest.call(this, 'POST', endpoint, formData, {}, {}, {
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

						if (imageNames.length > 5) {
							throw new NodeOperationError(
								this.getNode(),
								`Too many reference images (${imageNames.length}). Maximum allowed is 5 images.`,
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

		return [returnData];
	}
}
