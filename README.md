# Drawer designer utility

## Description

A simple utility to help with designing wooden drawers, and laying out the pieces on a larger wooden sheet for cutting with a table/track saw or CNC.

## Faatures

- Accepts a (single) drawer size, and n copies of that drawer
- Indicates where a rabbet should be cut; this is sized according to the thickness of the material
- Can incorporate a (variably-sized) margin between pieces, to account for material lost to cutting with the saw blade or CNC bit.
- Attempts to lay the pieces out fairly neatly
- Draws the layout visually (which can be saved with a right click > 'Save Image as...', or similar), including:
  - Individualy labelled pieces
  - Wastage due to cutting (blue)
  - Areas where a rabbet is needed (green)
  - Wastage/unused wood on the original sheet (pink)
- Calculates a (fairly) accurate summary

## Weaknesses

- The rectangle fitting algorithm is decent, but not optimal
  - It 'thinks' horizontally, so two vertically adjacent similarly-sized areas will not bbe considered as a single area for subsequent usage
- Only lays the pieces out on a single wooden sheet; if you are using smaller pieces in the real world (e.g. to account for availability or CNC bed size) you'll need to make the sheet larger, and then subdivide things yourself.
- Will warn if all pieces don't fit onto the current sheet, but won't do anything further.
- The space-sizing isn't always perfect; it's good enough to use for now, though.

## Future developoments

Maybe, but not guaranteed. If you've got a suggestion, please get in touch.

## Licence and acknowledgements

Coded/designed by Tom Moore. Licensed under the [GNU GPL v3 License](https://www.gnu.org/licenses/gpl-3.0.en.html).

Rectangle packing code modified from code shared by [Volodymyr Agafonkin](https://observablehq.com/@mourner/simple-rectangle-packing).
