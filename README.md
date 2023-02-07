# Instalments widget module

Widget ready for distribution

## Setup

* Place an insertion point in your HTML with an unique ID (i.e. `<div id="my-element-id"></div>` ).
* Load the module together the rest of libraries, before your js.
* Execute `window.renderInstalmentsWidget("my-element-id", 1500);` when you calculate the shopping basket or product price and when they change.
* `renderInstalmentsWidget(element_id, amount)` params:

    * element_id: string
    * amount: number

## How to run the project - example

### Run SeQura mocked API environment
* Read `api/README.md` for more information

### Run the example
* `npm install`
* `npm start`
* `live-server` server should be running on port 4000

## Nice to have

* In order to prevent styles clashing, CSS could be generated with the parent item as initial selector.
* A bunch of harcoded JS classes should be constants
* Split the code in different modules

