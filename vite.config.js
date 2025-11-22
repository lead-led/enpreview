import { sveltekit } from '@sveltejs/kit/vite';

const devServerPort = Number.parseInt(process.env.VITE_DEV_SERVER_PORT ?? '5173', 10);

const config = {
	plugins: [sveltekit()],
	server: {
		port: Number.isNaN(devServerPort) ? 5173 : devServerPort,
		strictPort: true,
	},
};

export default config;
