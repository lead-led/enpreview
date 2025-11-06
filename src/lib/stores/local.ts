import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type IpObj = {
	address: string;
	nic: string;
};

export const ips: Writable<IpObj[]> = writable([]);

export function setIps(newIps: IpObj[]) {
	ips.set(newIps);
}
