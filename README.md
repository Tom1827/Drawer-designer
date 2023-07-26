# Drawer designer utility

## Description

A simple utility to help with designing wooden drawers, and in particular laying out the pieces on a larger wooden sheet for assessing material meeds, and ultimately guiding cutting with a table/track saw or CNC.

## Features

- Accepts a (single) drawer size, and n copies of that drawer
- Indicates where rabbets should be cut (sized according to the thickness of the material)
- Can incorporate a margin between pieces, to account for material lost to cutting with a saw blade or CNC bit.
- Will lay out the different pieces fairly neatly and sensibly
- Draws the layout visually (which can be saved with a right click > 'Save Image as...', or similar), including:
  - Individualy labelled pieces
  - Wastage due to cutting (blue)
  - Areas where a rabbet is needed (green)
  - Wastage/unused wood on the original sheet (pink)
- Calculates a (fairly accurate) summary
- Allows the user to experiement with piece rotation to optimise layout beyond that offered by the algorithm
- ***Includes an experimental 3D visualisation, and the ability to export an STL file!***

## Limitations/weaknesses

- Only supports a design for a single method of drawer construction, as follows:
  - Full-sized side pieces, locating in a rabbet cut into both sides of front and back pieces
  - All vertical pieces have a rabbet cut into their bottom edge, into which a full thickness base piece locates
  - Therefore, no option for a thinner base piece in a slot
  - Also assumes that a separate (usually slightly larger) cosmetic face piece will probably be later added to the front - and this piece is _not_ included in the design
- The rectangle fitting algorithm is decent, but not optimal:
  - It 'thinks' horizontally, so two vertically adjacent similarly-sized areas will not be considered as a single area for subsequent usage
  - The sizing of left-over spaces isn't always perfect, and it sometimes does stupid things; it's *usually* good enough to use for now, though.
  - Only lays the pieces out on a single wooden sheet; if you are using smaller pieces in the real world (e.g. to account for availability or CNC bed size) you may need to make the virtual sheet larger in one dimension, and then subdivide things yourself.
  - Will warn if all pieces don't fit onto the current sheet, but won't do anything further.
- My code. I'm not a professional 🙂

## Future developoments

Maybe, but not guaranteed.

If you've got a suggestion, please get in touch.

## Licence and acknowledgements

Coded/designed by Tom Moore. Licensed under the [GNU GPL v3 License](https://www.gnu.org/licenses/gpl-3.0.en.html).

Rectangle packing code modified from code shared by [Volodymyr Agafonkin](https://observablehq.com/@mourner/simple-rectangle-packing).
