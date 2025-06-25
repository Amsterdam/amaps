# Amaps
Implementation of Amaps for Amsterdam

* For a demo, see https://amaps.amsterdam.nl/multiselect and https://amaps.amsterdam.nl/pointquery.

This repository contains several scripts for specific use cases, like querying certain APIs when the map is clicked. These specific cases are:

* point query (users selects a coordinate in a map and information about it is returned)
* multiple feature select (users selects one or more objects, parking spots in this case, and information about the selection is returned).

## How it works

- `pointquery`: demonstrates single-click functionality with a feature query.
- `multiselect`: demonstrates multiple feature selection from a feature datasource.

### with docker

To run the application in Docker: `make build && make dev` (accessible on port 8095)
