# Instalments widget module

Widget ready for distribution

## Build distribution file 
* `npm run build`

## How to use - Setup

* Place an insertion point in your HTML with an unique ID (i.e. `<div id="my-element-id"></div>` ).
* Load the module together the rest of libraries, before your js (`<script type="module" src="../dist/instalmentsWidget.min.js"></script>`)
* Once you calculate the shopping basket or product price and when they change, please execute `window.renderInstalmentsWidget("my-element-id", 1500);`
* `renderInstalmentsWidget(element_id, amount)` params:

    * element_id: string
    * amount: float

## How to run the example

### Run mocked API environment
* Read `api/README.md` for more information

### Run the example
* `npm install`
* `npm start`
* `live-server` server should be running on port 4000

## Nice to have

* CSS should be loaded from a CDN
* I don't have the CDN option for CSS, so in order to prevent styles clashing, CSS could be generated with the parent item as initial selector.
* A bunch of harcoded JS classes should be constants.
* Split the code in different modules.

