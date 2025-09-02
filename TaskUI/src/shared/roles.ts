export enum RoleEnum {
	ADMINISTRATOR = 'Administrator',
	USER = 'User',
	PLATFORM_ENGINEER = 'Platform Engineer',
	TERRAFORM_DEVELOPER = 'Terraform Developer',
	COMMERCIAL_APPROVER = 'Commercial Approver',
	TECHNICAL_APPROVER = 'Technical Approver',
	CLOUD_ADAPTION_TEAM = 'Cloud Adaption Team'
}

export class RoleGroup {
	static readonly ALL_ROLES: RoleEnum[] = [
		RoleEnum.ADMINISTRATOR,
		RoleEnum.CLOUD_ADAPTION_TEAM,
		RoleEnum.COMMERCIAL_APPROVER,
		RoleEnum.PLATFORM_ENGINEER,
		RoleEnum.TECHNICAL_APPROVER,
		RoleEnum.TERRAFORM_DEVELOPER,
		RoleEnum.USER
	];
}
