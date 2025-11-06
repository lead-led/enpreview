<script lang="ts">
	import { tallyFontSize, inPgm, inPvw, showName, showNumber } from '$lib/stores';
</script>

<div class="container" style={`font-size: ${$tallyFontSize}px`}>
	<div class="program">
		{$showNumber ? $inPgm.presetSno : ''}
		{$showName && $showNumber ? ' : ' : ' '}
		{$showName ? $inPgm.Name : ''}
	</div>
	<div class="preview">
		{$showNumber ? $inPvw.presetSno : ''}
		{$showName && $showNumber ? ' : ' : ' '}
		{$showName ? $inPvw.Name : ''}
	</div>
</div>

<style>
	.container {
		background: red;
		flex: 1;
		height: 100%;
		display: grid;
	}
	.program {
		background: red;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.preview {
		background: green;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
