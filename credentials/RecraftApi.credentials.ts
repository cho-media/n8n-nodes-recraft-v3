import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RecraftApi implements ICredentialType {
	name = 'recraftApi';
	displayName = 'Recraft API';
	documentationUrl = 'https://www.recraft.ai/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'recraft_api_token_here',
			description: 'Your Recraft API token. Get it from your <a href="https://app.recraft.ai/profile/api" target="_blank">Recraft profile API page</a>.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://external.api.recraft.ai/v1',
			url: '/users/me',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'id',
					value: '.*',
					message: 'Invalid API token. Please check your Recraft API credentials.',
				},
			},
		],
	};
}
