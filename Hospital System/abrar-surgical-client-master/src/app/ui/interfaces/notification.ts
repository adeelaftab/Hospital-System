export interface INotification {
	content: any,
	icon?: string,
	view?: string,
	title?: string,
	position?: string,
	animation?: string
	autohide?: boolean,
	progress?: boolean,
	showTimeout?: number,
	hideTimeout?: number,
	keepAfterRouterChange?: boolean,
}