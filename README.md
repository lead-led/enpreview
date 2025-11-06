This project uses the following libraries:

## JULY 26, 2023

You were working on the presetHasDestinationsThatAreBeingListenedTo function,
you are polling for the destinationsForPreset API, you don't know when to trigger it.

https://carbon-components-svelte.onrender.com/

### Request ID Codes

0 - presetList
1 - screen destination list
2 - aux destination list
3 -
4 - screen dest subcription
5 - aux dest subscription
6 - unSubscription
7 - list content, screens
8 - list content, aux
9 -
10 - power status

The request that shows current state of the hardware is, parsing this says when to switch PGM state:

-   listContent
-   listAuxContent

These API calls are requested when an incoming subscription message
is "ScreenDestChanged" or "AuxDestChanged"

The main functionality of the program saves the old state and compares the new state. This is done via the reponse of these two API
calls.

This was the original parsed state object:

const newLayerState = {
id: layer.id,
preview: layer.PvwMode,
program: layer.PgmMode,
};

////////////////////////////////////////

```

```

## TODO

When destinations refresh, need to parse which ones are being listened to

When a window is created, need to ask the backend for server information
