import { RoleEnum } from "../shared/roles";


export class RoleGroup {
	static readonly ALL_ROLES = [
		RoleEnum.ADMINISTRATOR,
		RoleEnum.CLOUD_ADAPTION_TEAM,
		RoleEnum.COMMERCIAL_APPROVER,
		RoleEnum.PLATFORM_ENGINEER,
		RoleEnum.TECHNICAL_APPROVER,
		RoleEnum.TERRAFORM_DEVELOPER,
		RoleEnum.USER
	];
}
