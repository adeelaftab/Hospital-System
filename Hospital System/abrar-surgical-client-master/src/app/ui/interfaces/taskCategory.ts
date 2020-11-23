import { ITask } from './task';

export interface ITaskCategory {
	active: boolean,
	title: string,
	tasks: Array<ITask>;
}